import { atom } from "jotai";
import { handleServerMessages } from "./tssrp6a-client-atoms";
export * from './tssrp6a-client-atoms';

const globalWorker = new Worker(new URL('../webworker/index.ts', import.meta.url), { type: 'module' });
export const workerAtom = atom(globalWorker);

globalWorker.addEventListener('message', handleServerMessages);
