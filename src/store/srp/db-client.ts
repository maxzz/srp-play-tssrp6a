import { uuid } from "@/utils";

// Client

export type UserCreds = {
    username: string;
    password: string;
};

export type UserState = {
    uuid: number; // local data for React UI only. initialized afted merge with localStorage data.
    logged?: boolean;
};

export type ClientUser = UserCreds & UserState;

export const initialClientUsersDb = (): ClientUser[] => [
    {
        username: 'Max',
        password: 'Password',

        uuid: 0,
    },
    {
        username: 'Tetyana',
        password: 'Password Tetyana',

        uuid: 0,
    },
    {
        username: 'Max Jr.',
        password: 'Password Max Jr.',

        uuid: 0,
    },
    {
        username: 'Thomas',
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

export function createNewLoginRow({ username, password }: UserCreds): ClientUser {
    return {
        username,
        password,
        uuid: uuid.asRelativeNumber(),
    };
}

//export const clientUsersDb = proxy(initialClientUsersDb);
