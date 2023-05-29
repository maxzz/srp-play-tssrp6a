import { atom } from "jotai";
import { C2W, W2C } from "@/webworker/messages";
import { UserCreds, srp6aRoutines, setUsersLogged } from "@/store";
import { SRPClientSession } from "tssrp6a";
import { workerAtom } from "..";

type C2WQuery = {
    resolve: Function;
    reject: Function;
};

let lastQueryId = 0;
const c2wQueries = new Map<number, C2WQuery>();

export const doLogInAtom = atom(
    null,
    async (get, set, value: UserCreds) => {
        const worker = get(workerAtom);

        // 1.

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
            console.error(`step 1 error: ${error}`);
            return;
        }

        // 2.

        const srp6aClient = await new SRPClientSession(srp6aRoutines).step1(value.username, value.password);
        const srp6aClient_step2 = await srp6aClient.step2(step1Result.salt, step1Result.serverB);

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
        let resultError;
        try {
            serverM2 = await step2Promise;
        } catch (error) {
            resultError = error;
        }

        setUsersLogged(value.username, !resultError);

        resultError ? console.error(`step 2 error: ${resultError}`) : console.log('client: step 2 done', serverM2, c2wQueries);
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