export namespace C2W { // Client to Worker

    export type CallTypes = 'signup' | 'signin' | 'step2';

    export type CallType = {
        type: CallTypes;
    };

    export type Step2 = CallType;

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

    export type MsgSignIn = {
        type: 'signin',
        username: string;
        salt: string;
        verifier: string;
    };

    export type ClientMessages = MsgSignUp | MsgSignOut | MsgSignIn;
}
