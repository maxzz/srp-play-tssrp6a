import { atom } from "jotai";
import { UserCreds, appUi, srp6aRoutines } from "../store";
import { createVerifierAndSalt } from "tssrp6a";
import { C2W } from "./messages";

export const workerAtom = atom(new Worker(new URL('../webworker/index.ts', import.meta.url), { type: 'module' }));

// export const doCallWorkerAtom = atom(
//     null,
//     (get, set, value: C2W.MsgSignIn | C2W.CallType) => {
//         const worker = get(workerAtom);
//         worker.postMessage(value);
//     }
// );

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

        const worker = get(workerAtom);
        worker.postMessage(msg);
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

        const worker = get(workerAtom);
        worker.postMessage(msg);
    }
);
