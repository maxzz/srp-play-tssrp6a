import { ServerUsersInStore } from "@/store/srp/db-server";

export namespace C2W { // Client to Worker

    export type CallTypes = 'signup' | 'login' | 'step2' | 'login-step1';

    export type CallType = {
        type: CallTypes;
    };

    export type Step2 = CallType;

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

    export type MsgLogIn = {
        type: 'login',
        idOnClient: number;
        username: string;
    };

    export type MsgLogInStep1 = {
        type: 'login-step1',
        id: number;

    };

    export type ClientMessages = MsgSyncClientToServerDb | MsgSignUp | MsgSignOut | MsgLogIn | MsgLogInStep1;
}

export namespace W2C { // Worker to Client
    export type MsgLogInStep1Reply = {
        type: 'login-step1',
        idFromClient: number;
        serverB?: bigint;
        error?: string;
    };

    export type WorkerMessages = MsgLogInStep1Reply;
}
