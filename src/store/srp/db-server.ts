// Server

export type ServerUser = {
    salt: bigint;
    verifier: bigint;
};

export type ServerUsers = {
    [username: string]: ServerUser;
};

export const initialServerUsersDb = (): ServerUsers => ({
    "Foo": {
        salt: BigInt('11123'),
        verifier: BigInt('654'),
    }
});
