import { atom } from "jotai";

export const workerAtom = atom(new Worker(new URL('../web-worker/index.ts', import.meta.url), {type: 'module'}));

export const doCallWorkerStartLoginAtom = atom(
    null,
    (get, set, value) => {
        const worker = get(workerAtom);
        worker.postMessage('qqqqqqqqq');
    }
)