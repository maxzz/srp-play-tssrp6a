import { atom } from "jotai";

export const workerAtom = atom(new Worker(new URL('../web-worker/index.ts', import.meta.url), {type: 'module'}));
