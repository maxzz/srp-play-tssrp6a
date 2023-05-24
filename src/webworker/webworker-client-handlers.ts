import { atom } from "jotai";
import { UserCreds } from "../store";

export const workerAtom = atom(new Worker(new URL('../webworker/index.ts', import.meta.url), { type: 'module' }));

export namespace C2W { // Client to Worker

    export type CallTypes = 'call-login' | 'step2';

    export type CallType = {
        type: CallTypes;
    };

    export type CallLogin =
        CallType
        & {
            username: string;
            password: string;
        };

    export type Step2 = CallType;
}

export const doCallWorkerAtom = atom(
    null,
    (get, set, value: C2W.CallLogin | C2W.CallType) => {
        const worker = get(workerAtom);
        worker.postMessage(value);
    }
);

type MsgSignIn = {
    type: 'signin',
} & UserCreds;

export const signinAtom = atom(
    null,
    (get, set, value: UserCreds) => {
        const worker = get(workerAtom);
        
        const msg: MsgSignIn = {
            type: 'signin',
            username: value.username,
            password: value.password,
        }
        worker.postMessage(msg);
    }
)
