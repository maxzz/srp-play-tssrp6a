import { atom } from "jotai";
import { snapshot } from "valtio";
import { C2W, W2C } from "./messages";
import { UserCreds, appUi, serializeServerUsers, srp6aRoutines } from "../store";
import { SRPClientSession, createVerifierAndSalt } from "tssrp6a";

const globalWorker = new Worker(new URL('../webworker/index.ts', import.meta.url), { type: 'module' });
export const workerAtom = atom(globalWorker);

globalWorker.addEventListener('message', handleServerMessages);

export const doSyncDbAtom = atom(
    null,
    (get, set,) => {
        const db = snapshot(appUi.dataState.server.db);

        const msg: C2W.MsgSyncClientToServerDb = {
            type: 'syncdb',
            db: serializeServerUsers(db),
        };

        get(workerAtom).postMessage(msg);
    }
);

export const doSignUpAtom = atom(
    null,
    async (get, set, value: UserCreds) => {
        const { s: salt, v: verifier } = await createVerifierAndSalt(srp6aRoutines, value.username, value.password);

        const msg: C2W.MsgSignUp = {
            type: 'signup',
            username: value.username,
            salt: salt.toString(),
            verifier: verifier.toString(),
        };

        appUi.dataState.server.db.set(msg.username, { salt, verifier });

        get(workerAtom).postMessage(msg);
    }
);

export const doSignOutAtom = atom(
    null,
    async (get, set, value: { username: string; }) => {
        appUi.dataState.server.db.delete(value.username);

        const msg: C2W.MsgSignOut = {
            type: 'signout',
            username: value.username,
        };

        get(workerAtom).postMessage(msg);
    }
);

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

        const result = new Promise<bigint>((resolve, reject) => c2wQueries.set(++lastQueryId, { resolve, reject, }));

        const msg: C2W.MsgLogInStep1 = {
            type: 'login-step1',
            idOnClient: lastQueryId,
            username: value.username,
        };

        worker.postMessage(msg);

        const serverB = await result;
        
        console.log('got it 1', serverB, c2wQueries);
        c2wQueries.delete(lastQueryId);


        // 2.

        const { s: salt, v: verifier } = await createVerifierAndSalt(srp6aRoutines, value.username, value.password);
        const srp6aClient = await new SRPClientSession(srp6aRoutines).step1(value.username, value.password);

        const srp6aClient_step2 = await srp6aClient.step2(salt, serverB);

        const result2 = new Promise<bigint>((resolve, reject) => c2wQueries.set(++lastQueryId, { resolve, reject, }));

        const msg2: C2W.MsgLogInStep2 = {
            type: 'login-step2',
            idOnClient: lastQueryId,
            username: value.username,
            A: srp6aClient_step2.A,
            M1: srp6aClient_step2.M1,
        };

        worker.postMessage(msg);

        const serverM2 = await result2;

        c2wQueries.delete(lastQueryId);

        console.log('got it 2', serverM2);
    }
);

function handleServerMessages({ data }: MessageEvent<W2C.WorkerMessages>) {
    switch (data.type) {
        case 'login-step1-reply': {
            const { idFromClient, serverB, error } = data;
            const query = c2wQueries.get(idFromClient);

            if (!query) {
                console.error('no query ID', idFromClient);
                return;
            }

            if (error) {
                query.reject(error);
                return;
            }

            if (!serverB) {
                query.reject('no serverB');
                return;
            }

            query.resolve(serverB);
            break;
        }
        case 'login-step2-reply': {
            const { idFromClient, error } = data;
            const query = c2wQueries.get(idFromClient);

            if (!query) {
                console.error('no query ID', idFromClient);
                return;
            }

            if (error) {
                query.reject(error);
                return;
            }

            // if (!serverB) {
            //     query.reject('no serverB');
            //     return;
            // }

            // query.resolve(serverB);
            break;
        }
    }
    console.log('FROM SERVER DATA', data);
}
