import { proxyMap } from "valtio/utils";
import { C2W } from "./messages";
import { ServerUser } from "@/store/srp/db-server";

const serverDb = proxyMap<string, ServerUser>();

export function onServerMessages({ data }: MessageEvent<C2W.ClientMessages>) {
    // console.log('worker: message from client', data);

    // self.postMessage('worker: to client');
    switch (data.type) {
        case 'signup': {
            const { username, salt: saltStr, verifier: verifierStr, } = data;
            serverDb.set(username, {
                salt: BigInt(saltStr),
                verifier: BigInt(verifierStr),
            });
            break;
        }
        case 'signout': {
            const { username } = data;
            serverDb.delete(username);
            break;
        }
        case 'signin': {
            const { username, salt: saltStr, verifier: verifierStr, } = data;
            serverDb.set(username, {
                salt: BigInt(saltStr),
                verifier: BigInt(verifierStr),
            });
            break;
        }
        default: {
            throw new Error('not implemented yet');
        }
    }
}
