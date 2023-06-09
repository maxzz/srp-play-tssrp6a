import { atom } from "jotai";
import { onMessagesFromTsSrp6aServer } from "./tssrp6a-client-atoms";
export * from './tssrp6a-client-atoms';

const globalWorker = new Worker(new URL('../webworker-server-handlers/index.ts', import.meta.url), { type: 'module' });
export const workerAtom = atom(globalWorker);

globalWorker.addEventListener('message', onMessagesFromTsSrp6aServer);
