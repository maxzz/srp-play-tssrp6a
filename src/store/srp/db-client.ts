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
        username: 'Foo',
        password: 'Password Foo',

        uuid: 0,
    },
    {
        username: 'Bar',
        password: 'Password Bar',

        uuid: 0,
    },
];

export function initUserState(clients: ClientUser[]) {
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
