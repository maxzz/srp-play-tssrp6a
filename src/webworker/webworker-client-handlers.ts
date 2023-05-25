import { atom } from "jotai";
import { snapshot } from "valtio";
import { C2W, W2C } from "./messages";
import { UserCreds, appUi, serializeServerUsers, srp6aRoutines } from "../store";
import { SRPClientSession, createVerifierAndSalt } from "tssrp6a";

const globalWorker = new Worker(new URL('../webworker/index.ts', import.meta.url), { type: 'module' });
export const workerAtom = atom(globalWorker);

globalWorker.addEventListener('message', handleServerMessages);

function handleServerMessages({ data }: MessageEvent<W2C.WorkerMessages>) {
    switch (data.type) {
        case 'login-step1': {
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
            }
            
            query.resolve(serverB);
            break;
        }
    }
    console.log('FROM SERVER DATA', data);
}

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

        const result = new Promise((resolve, reject) => {
            c2wQueries.set(++lastQueryId, {
                resolve,
                reject,
            });
        });

        const msg: C2W.MsgLogIn = {
            type: 'login',
            idOnClient: lastQueryId,
            username: value.username,
        };

        worker.postMessage(msg);

        const res = await result;
        console.log('got it');

        // const srp6aClient = await new SRPClientSession(srp6aRoutines).step1(value.username, value.password);

    }
);
