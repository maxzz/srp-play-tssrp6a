import { uuid } from "@/utils";

// Client

export type UserCreds = {
    name: string;
    password: string;
};

export type UserState = {
    uuid: number; // local data for React UI only. initialized afted merge with localStorage data.
    logged?: boolean;
};

export type ClientUser = UserCreds & UserState;

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

export function initUiid(clients: ClientUser[]) {
    clients.forEach((item) => {
        item.uuid = uuid.asRelativeNumber();
        item.logged = false;
    });
}

export function createNewLoginRow(name: string, password: string): ClientUser {
    return {
        name,
        password,
        uuid: uuid.asRelativeNumber(),
    };
}

//export const clientUsersDb = proxy(initialClientUsersDb);
