// Server

export type ServerUser = {
    salt: bigint;
    verifier: bigint;
};

export type ServerUsers = {
    [username: string]: ServerUser;
};
