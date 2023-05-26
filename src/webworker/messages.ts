import { ServerUsersInStore } from "@/store/srp/db-server";

export namespace C2W { // Client to Worker

    export type MsgSyncClientToServerDb = {
        type: 'syncdb',
        db: ServerUsersInStore;
    };

    export type MsgSignUp = {
        type: 'signup',
        username: string;
        salt: string;
        verifier: string;
    };

    export type MsgSignOut = {
        type: 'signout',
        username: string;
    };

    export type MsgLogInStep1 = {
        type: 'login-step1',
        idOnClient: number;
        username: string;
    };

    export type MsgLogInStep2 = {
        type: 'login-step2',
        idOnClient: number;
        username: string;
        A: bigint;
        M1: bigint;
    };

    export type ClientMessages = MsgSyncClientToServerDb | MsgSignUp | MsgSignOut | MsgLogInStep1 | MsgLogInStep2;
}

export namespace W2C { // Worker to Client

    export type MsgLogInStep1Reply = {
        type: 'login-step1-reply',
        idFromClient: number;
        error?: string;
        salt?: bigint;
        serverB?: bigint;
    };

    export type MsgLogInStep2Reply = {
        type: 'login-step2-reply',
        idFromClient: number;
        error?: string;
        serverM2?: bigint;
    };

    export type WorkerMessages = MsgLogInStep1Reply | MsgLogInStep2Reply;
}
