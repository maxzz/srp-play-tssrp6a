import { C2W } from "./messages";
import { ServerUser, deserializeServerUser } from "@/store/srp/db-server";

const serverDb = new Map<string, ServerUser>();

export function onServerMessages({ data }: MessageEvent<C2W.ClientMessages>) {
    // console.log('worker: message from client', data);

    // self.postMessage('worker: to client');
    switch (data.type) {
        case 'syncdb': {
            const { db } = data;
            [...Object.entries(db)].forEach(([k, v]) => serverDb.set(k, deserializeServerUser(v)));
            break;
        }
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
        case 'login': {
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
