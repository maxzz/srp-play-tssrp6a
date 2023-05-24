import { atom } from "jotai";
import { UserCreds, srp6aRoutines } from "../store";
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

export const doSigninAtom = atom(
    null,
    async (get, set, value: UserCreds) => {
        const worker = get(workerAtom);

        const { s: salt, v: verifier } = await createVerifierAndSalt(srp6aRoutines, value.username, value.password);

        const msg: C2W.MsgSignIn = {
            type: 'signin',
            username: value.username,
            salt: salt.toString(),
            verifier: verifier.toString(),
        };

        worker.postMessage(msg);
    }
);
