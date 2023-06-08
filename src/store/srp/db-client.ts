import { uuid } from "@/utils";
import { INTERNAL_Snapshot } from "valtio";

export type UserCreds = {
    username: string;
    password: string;
};

export type UserState = {       // Local data for React UI only. initialized afted merge with localStorage data.
    uuid: number;
    logged?: boolean;
    loginFailed?: boolean;      // This will be set for 1 sec. after login attempt failed.
    iv?: bigint;                // M1 as iv vector for encrypt/decrypt
    sk?: bigint;                // Session key
    msgClientToServer?: string; // Test message sent from server to client will be shown for 1 sec.
    msgServerToClient?: string; // Test message sent from client to server will be shown for 1 sec.
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
