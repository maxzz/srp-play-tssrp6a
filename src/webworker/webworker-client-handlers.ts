import { atom } from "jotai";
import { ServerUsersInStore, UserCreds, appUi, srp6aRoutines } from "../store";
import { createVerifierAndSalt } from "tssrp6a";
import { C2W } from "./messages";

const worker = new Worker(new URL('../webworker/index.ts', import.meta.url), { type: 'module' });
export const workerAtom = atom(worker);

// export const doCallWorkerAtom = atom(
//     null,
//     (get, set, value: C2W.MsgSignIn | C2W.CallType) => {
//         const worker = get(workerAtom);
//         worker.postMessage(value);
//     }
// );

export function syncDb(db: ServerUsersInStore) {
    const msg: C2W.MsgSyncClientToServerDb = {
        type: 'syncdb',
        db,
    }
    worker.postMessage(msg);
}

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
    async (get, set, value: {username: string}) => {
        appUi.dataState.server.db.delete(value.username);

        const msg: C2W.MsgSignOut = {
            type: 'signout',
            username: value.username,
        }

        get(workerAtom).postMessage(msg);
    }
);

export const doSignInAtom = atom(
    null,
    async (get, set, value: UserCreds) => {
        const { s: salt, v: verifier } = await createVerifierAndSalt(srp6aRoutines, value.username, value.password);

        const msg: C2W.MsgSignIn = {
            type: 'signin',
            username: value.username,
            salt: salt.toString(),
            verifier: verifier.toString(),
        };

        get(workerAtom).postMessage(msg);
    }
);
