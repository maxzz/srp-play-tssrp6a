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
        name: 'max',
        password: 'pass',

        uuid: uuid.asRelativeNumber(),
    },
    {
        name: 'max jr.',
        password: 'pass jr.',

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
