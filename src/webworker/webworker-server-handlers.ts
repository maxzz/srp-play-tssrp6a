import { C2W, W2C } from "./messages";
import { ServerUser, deserializeServerUser } from "@/store/srp/db-server";
import { srp6aRoutines } from "@/store/srp/srp-protocol-init";
import { SRPServerSession, SRPServerSessionStep1 } from "tssrp6a";

type InternalServerUser = ServerUser & {
    server?: SRPServerSessionStep1;
};

const serverDb = new Map<string, InternalServerUser>();

export async function onServerMessages({ data }: MessageEvent<C2W.ClientMessages>) {
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
            const { username, idOnClient } = data;

            //debugger
            console.log('server1 "login"');

            const user = serverDb.get(username);

            const msg: W2C.MsgLogInStep1Reply = {
                type: 'login-step1',
                idFromClient: idOnClient,
            };

            if (!user) {
                msg.error = 'no-user';
                globalThis.postMessage(msg);
                return;
            }

            const server = await new SRPServerSession(srp6aRoutines).step1(username, user.salt, user.verifier);

            user.server = server;
            msg.serverB = server.B;

            console.log('server1 "login" replied OK');

            globalThis.postMessage(msg);

            break;
        }
        default: {
            throw new Error('not implemented yet');
        }
    }
}
//Module "crypto" has been externalized for browser compatibility. Cannot access "crypto.webcrypto" in client code.
//vitejs Module "crypto" has been externalized for browser compatibility. Cannot access "crypto.webcrypto" in client code.