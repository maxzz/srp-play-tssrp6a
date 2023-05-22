import { atom } from "jotai";

export const workerAtom = atom(new Worker(new URL('../web-worker/index.ts', import.meta.url), { type: 'module' }));

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
