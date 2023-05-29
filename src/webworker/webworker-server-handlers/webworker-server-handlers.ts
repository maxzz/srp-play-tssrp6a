import { C2W, W2C } from "../messages";
import { ServerUser, IOServer } from "@/store/srp/db-server";
import { srp6aRoutines } from "@/store/srp/srp-protocol-init";
import { SRPServerSession, SRPServerSessionStep1 } from "tssrp6a";

type InternalServerUser = ServerUser & {
    server?: SRPServerSessionStep1;
};

const serverDb = new Map<string, InternalServerUser>();

export async function onMessagesFromClient({ data }: MessageEvent<C2W.ClientMessages>) {
    switch (data.type) {
        case 'syncdb': {
            const { db } = data;
            [...Object.entries(db)].forEach(([k, v]) => serverDb.set(k, IOServer.deserializeServerUser(v)));
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
            const { idOnClient, username } = data;
            const msg: W2C.MsgLogInStep1Reply = { type: 'login-step1-reply', idFromClient: idOnClient, };

            const user = serverDb.get(username);
            if (user) {
                user.server = await new SRPServerSession(srp6aRoutines).step1(username, user.salt, user.verifier);
                msg.salt = user.salt;
                msg.serverB = user.server.B;
            } else {
                msg.error = `not registered user: ${username}`;
            }

            globalThis.postMessage(msg);
            break;
        }
        case 'login-step2': {
            const { idOnClient, username, A, M1 } = data;
            const msg: W2C.MsgLogInStep2Reply = { type: 'login-step2-reply', idFromClient: idOnClient, };

            const user = serverDb.get(username);
            if (user?.server) {
                try {
                    const serverM2 = await user.server.step2(A, M1);
                    msg.serverM2 = serverM2;

                    const serverSessionKey = await user.server.sessionKey(A);
                    console.log('%cclient verified, Server shared session key = %s', 'color: green', serverSessionKey);
                } catch (error) {
                    msg.error = error instanceof Error ? `<${error.message}>` : (error as any).toString();
                    user.server = undefined;
                }
            } else {
                msg.error = `user: ${username} wo/ step1`;
            }

            globalThis.postMessage(msg);

            break;
        }
        default: {
            throw new Error('not implemented yet');
        }
    }
}
