import { atom } from "jotai";
import { snapshot } from "valtio";
import { C2W } from "./messages";
import { UserCreds, appUi, serializeServerUsers, srp6aRoutines } from "../store";
import { createVerifierAndSalt } from "tssrp6a";

export const workerAtom = atom(new Worker(new URL('../webworker/index.ts', import.meta.url), { type: 'module' }));

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

export const doLogInAtom = atom(
    null,
    async (get, set, value: UserCreds) => {
        const { s: salt, v: verifier } = await createVerifierAndSalt(srp6aRoutines, value.username, value.password);

        const msg: C2W.MsgLogIn = {
            type: 'login',
            username: value.username,
            salt: salt.toString(),
            verifier: verifier.toString(),
        };

        get(workerAtom).postMessage(msg);
    }
);
