import { atom } from "jotai";

export const workerAtom = atom<Worker | null>(null);