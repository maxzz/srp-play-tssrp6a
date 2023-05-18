// Client

export type ClientUser = {
    name: string;
    password: string;

    uuid: number; // local data for React UI only. initialized afted merge with localStorage data.
    logged?: boolean;
};

export const initialClientUsersDb = (): ClientUser[] => [
    {
        name: 'Max',
        password: 'Password',

        uuid: 0,
    },
    {
        name: 'Tetyana',
        password: 'Password Tetyana',

        uuid: 0,
    },
    {
        name: 'Max Jr.',
        password: 'Password Max Jr.',

        uuid: 0,
    },
    {
        name: 'Thomas',
        password: 'Password Thomas',

        uuid: 0,
    },
];

//export const clientUsersDb = proxy(initialClientUsersDb);

// Server

export type ServerUser = {
    salt: bigint;
    verifier: bigint;
};

//export const serverUsersDb = proxy<ServerUser[]>([]);
