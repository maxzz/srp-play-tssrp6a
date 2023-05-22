import { atom } from "jotai";

export const workerAtom = atom(new Worker(new URL('../web-worker/index.ts', import.meta.url), { type: 'module' }));

export type CallType = 'call-login';

export type CallLogin = {
    type: CallType;
    username: string;
    password: string;
};

export const doCallWorkerAtom = atom(
    null,
    (get, set, value: CallLogin) => {
        const worker = get(workerAtom);
        worker.postMessage(value);
    }
);
