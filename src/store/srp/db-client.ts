import { uuid } from "@/utils";
import { INTERNAL_Snapshot } from "valtio";

export type UserCreds = {
    username: string;
    password: string;
};

export type UserState = {
    uuid: number;   // local data for React UI only. initialized afted merge with localStorage data.
    logged?: boolean;
    loginFailed?: boolean; // This will be set for 1s after login attempt failed.
    iv?: bigint;    // M1 as iv vector for encrypt/decrypt
    sk?: bigint;    // session key
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

export namespace IOClient {
    export function serializeForLoaclstoreServerUser(clientUsers: INTERNAL_Snapshot<ClientUser[]>): UserCreds[] {
        return clientUsers.map(({ username, password }) => ({ username, password }));
    }
}

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
