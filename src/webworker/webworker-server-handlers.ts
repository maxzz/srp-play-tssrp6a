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
        case 'login-step1': {
            const { username, idOnClient } = data;

            console.log('server: "login-step1" begin"');

            const user = serverDb.get(username);

            const msg: W2C.MsgLogInStep1Reply = {
                type: 'login-step1-reply',
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

            console.log('server: "login-step1" done');

            globalThis.postMessage(msg);

            break;
        }
        case 'login-step2': {
            const { idOnClient, username, A, M1 } = data;

            console.log('server: "login-step2" begin"');

            const user = serverDb.get(username);

            const msg: W2C.MsgLogInStep2Reply = {
                type: 'login-step2-reply',
                idFromClient: idOnClient,
            };

            if (!user || !user.server) {
                msg.error = 'no-user or server';
                globalThis.postMessage(msg);
                return;
            }

            const serverM2 = await user.server.step2(A, M1);
            msg.serverM2 = serverM2;

            console.log('server: "login-step2" done');

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
