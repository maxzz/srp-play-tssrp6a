import { atom } from "jotai";

export const workerAtom = atom(new Worker(new URL('../web-worker/web-worker-body.ts', import.meta.url)));
