import { atom } from "jotai";
import { C2W, W2C } from "@/webworker/messages";
import { UserCreds, srp6aRoutines, setUsersSessionKeys } from "@/store";
import { SRPClientSession, SRPClientSessionStep2 } from "tssrp6a";
import { workerAtom } from "..";

type C2WQuery = {
    resolve: Function;
    reject: Function;
};

let lastQueryId = 0;
const c2wQueries = new Map<number, C2WQuery>();

function errorToString(error: unknown) {
    return (error instanceof Error ? error.message : `${error}`) || 'unknown error';
}

export const doLogInAtom = atom(
    null,
    async (get, set, value: UserCreds): Promise<{ error: string; } | { error?: undefined; }> => {
        const worker = get(workerAtom);

        // 1. Step 1. get server salt and B from server

        const step1Promise = new Promise<{ salt: bigint, serverB: bigint; }>((resolve, reject) => c2wQueries.set(++lastQueryId, { resolve, reject, }));

        const msg: C2W.MsgLogInStep1 = {
            type: 'login-step1',
            idOnClient: lastQueryId,
            username: value.username,
        };

        worker.postMessage(msg);

        let step1Result: Awaited<typeof step1Promise>;
        try {
            step1Result = await step1Promise;
        } catch (error) {
            return { error: errorToString(error) };
        }

        // 2. Step 2. send to server client's M1 and A

        let srp6aClient_step2: SRPClientSessionStep2;
        try {
            const srp6aClient = await new SRPClientSession(srp6aRoutines).step1(value.username, value.password);
            srp6aClient_step2 = await srp6aClient.step2(step1Result.salt, step1Result.serverB);
        } catch (error) {
            return { error: errorToString(error) };
        }

        const step2Promise = new Promise<bigint>((resolve, reject) => c2wQueries.set(++lastQueryId, { resolve, reject, }));

        const msg2: C2W.MsgLogInStep2 = {
            type: 'login-step2',
            idOnClient: lastQueryId,
            username: value.username,
            A: srp6aClient_step2.A,
            M1: srp6aClient_step2.M1,
        };

        worker.postMessage(msg2);

        let serverM2: bigint = 0n;
        try {
            serverM2 = await step2Promise; // Server verified us
        } catch (error) {
            return { error: errorToString(error) };
        }

        // 3. Step3. verify server by checking M2

        try {
            await srp6aClient_step2.step3(serverM2);
        } catch (error) {
            return { error: errorToString(error) };
        }

        // console.log('%cClient: server verified, client session key = %c%s', 'color: deepskyblue', 'color: gray', srp6aClient_step2.S);
        // console.log('%cClient: server verified, client M1 (as iv) = %c%s', 'color: deepskyblue', 'color: gray', srp6aClient_step2.M1);

        setUsersSessionKeys(value, { iv: srp6aClient_step2.M1, sk: srp6aClient_step2.S });
        return {};
    }
);

export function onMessagesFromTsSrp6aServer({ data }: MessageEvent<W2C.WorkerMessages>) {
    //console.log('%cclient got from server', 'color: orange', data);

    switch (data.type) {
        case 'login-step1-reply': {
            const { salt, serverB } = data;
            getQuery(data)?.resolve({ salt, serverB });
            break;
        }
        case 'login-step2-reply': {
            const { serverM2 } = data;
            getQuery(data)?.resolve(serverM2);
            break;
        }
    }

    function getQuery(data: W2C.WorkerMessages): C2WQuery | undefined {
        const { idFromClient, error } = data;
        const query = c2wQueries.get(idFromClient);
        if (query) {
            c2wQueries.delete(idFromClient);
            error && query.reject(error);
            return !error ? query : undefined;
        } else {
            console.error(`No query ID: ${idFromClient}`);
        }
    }
}
