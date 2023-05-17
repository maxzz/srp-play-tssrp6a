import { proxy } from "valtio";
import { uuid } from "../../utils";

// Client

export type ClientUser = {
    name: string;
    password: string;

    uuid: number; // local data for React UI only
};

const initialClientUsersDb: ClientUser[] = [
    {
        name: 'Max',
        password: 'Password',

        uuid: uuid.asRelativeNumber(),
    },
    {
        name: 'Tetyana',
        password: 'Password Tetyana',

        uuid: uuid.asRelativeNumber(),
    },
    {
        name: 'Max Jr.',
        password: 'Password Max Jr.',

        uuid: uuid.asRelativeNumber(),
    },
    {
        name: 'Thomas',
        password: 'Password Thomas',

        uuid: uuid.asRelativeNumber(),
    },
];

export const clientUsersDb = proxy(initialClientUsersDb);

// Server

export type ServerUser = {
    salt: bigint;
    verifier: bigint;
};

export const serverUsersDb = proxy<ServerUser[]>([]);
