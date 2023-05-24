export namespace C2W { // Client to Worker

    export type CallTypes = 'signin' | 'step2';

    export type CallType = {
        type: CallTypes;
    };

    export type Step2 = CallType;

    export type MsgSignIn = {
        type: 'signin',
        username: string;
        salt: string;
        verifier: string;
    };

    export type ClientMessages = MsgSignIn;
}
