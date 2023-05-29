import { atom } from "jotai";
import { snapshot } from "valtio";
import { C2W } from "@/webworker/messages";
import { UserCreds, appUi, IOServer, srp6aRoutines, workerAtom, setUsersLogged } from "@/store";
import { createVerifierAndSalt } from "tssrp6a";

export * from './login-flow';

export const doSyncDbAtom = atom(
    null,
    (get, set,) => {
        const db = snapshot(appUi.dataState.server.db);

        const msg: C2W.MsgSyncClientToServerDb = {
            type: 'syncdb',
            db: IOServer.serializeServerUsers(db),
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
        get(workerAtom).postMessage(msg);

        appUi.dataState.server.db.set(msg.username, { salt, verifier });
    }
);

export const doSignOutAtom = atom(
    null,
    (get, set, value: { username: string; }) => {
        appUi.dataState.server.db.delete(value.username);

        const msg: C2W.MsgSignOut = {
            type: 'signout',
            username: value.username,
        };
        get(workerAtom).postMessage(msg);

        setUsersLogged(value.username, false);
    }
);

export const doRemoveUserCredsAtom = atom(
    null,
    (get, set, value: { uuid: number; }) => {
        const idx = appUi.dataState.client.db.findIndex((user) => user.uuid === value.uuid);
        if (idx !== -1) {
            const username = appUi.dataState.client.db[idx].username;
            appUi.dataState.client.db.splice(idx, 1);
            set(doSignOutAtom, { username });
        }
    }
);

export const doLogOutUserAtom = atom(
    null,
    (get, set, value: { username: string; }) => {
        setUsersLogged(value.username, false);
    }
);
