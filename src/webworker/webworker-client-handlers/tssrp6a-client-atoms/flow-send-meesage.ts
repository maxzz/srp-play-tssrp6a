import { atom } from "jotai";
import { ClientUser, workerAtom } from "@/store";
import { C2W, W2C } from "@/webworker/messages";

export const doSendMessage = atom(null,
    (get, set, value: { user: ClientUser; msg: string; }) => {
        const worker = get(workerAtom);
    }
);
