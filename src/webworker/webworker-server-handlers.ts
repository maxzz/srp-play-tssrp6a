import { C2W, W2C } from "./messages";
import { ServerUser, deserializeServerUser } from "@/store/srp/db-server";
import { srp6aRoutines } from "@/store/srp/srp-protocol-init";
import { SRPServerSession, SRPServerSessionStep1 } from "tssrp6a";

type InternalServerUser = ServerUser & {
    server?: SRPServerSessionStep1;
};

const serverDb = new Map<string, InternalServerUser>();

export async function onServerMessages({ data }: MessageEvent<C2W.ClientMessages>) {
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
            console.log('server: "login-step1" begin"');

            const { idOnClient, username } = data;
            const msg: W2C.MsgLogInStep1Reply = { type: 'login-step1-reply', idFromClient: idOnClient, };

            const user = serverDb.get(username);
            if (user) {
                user.server = await new SRPServerSession(srp6aRoutines).step1(username, user.salt, user.verifier);
                msg.salt = user.salt;
                msg.serverB = user.server.B;
            } else {
                msg.error = `step1: not registered user: ${username}`;
            }
            globalThis.postMessage(msg);

            console.log('server: "login-step1" done');
            break;
        }
        case 'login-step2': {
            console.log('server: "login-step2" begin"', data);

            const { idOnClient, username, A, M1 } = data;
            const msg: W2C.MsgLogInStep2Reply = { type: 'login-step2-reply', idFromClient: idOnClient, };

            const user = serverDb.get(username);
            if (user?.server) {
                try {
                    const serverM2 = await user.server.step2(A, M1);
                    msg.serverM2 = serverM2;
                } catch (error) {
                    msg.error = error instanceof Error ? `<${error.message}>` : (error as any).toString();
                    user.server = undefined;
                }
            } else {
                msg.error = `step2: not registered user: ${username} or no server from step1`;
            }
            globalThis.postMessage(msg);

            console.log('server: "login-step2" done');
            break;
        }
        default: {
            throw new Error('not implemented yet');
        }
    }
}
