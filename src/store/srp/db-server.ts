// Server

export type ServerUser = {
    salt: bigint;
    verifier: bigint;
};

//export const serverUsersDb = proxy<ServerUser[]>([]);
