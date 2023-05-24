import { proxyMap } from 'valtio/utils';

// In memory

export type ServerUser = {
    salt: bigint;
    verifier: bigint;
};

export type ServerUsersMap = Map<string, ServerUser>;

// In store

export type ServerUserInStore = {
    salt: string;
    verifier: string;
};

export type ServerUsersInStore = {
    [username: string]: ServerUserInStore;
};

// Serialize / Deserialize

export function serializeServerUser(serverUser: ServerUser): ServerUserInStore {
    return Object.fromEntries(Object.entries(serverUser).map(([k, v]) => [k, typeof v === 'bigint' ? v.toString() : v])) as ServerUserInStore;
}

export function deserializeServerUser(obj: ServerUserInStore): ServerUser {
    const isBigInt = (k: string) => k === 'salt' || k === 'verifier';
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, isBigInt(k) ? BigInt(v as string) : v])) as ServerUser;
}

export function serializeServerUsers(serverUsers: ServerUsersMap): ServerUsersInStore {
    const a = [...serverUsers.entries()].map(([k, v]) => [k, serializeServerUser(v)] as const);
    return Object.fromEntries(a);
}

export function deserializeServerUsers(serverUsers: ServerUsersInStore): ServerUsersMap {
    return proxyMap([...Object.entries(serverUsers)].map(([k, v]) => [k, deserializeServerUser(v)] as const));
}

// Initialize in InStore format

export const initialServerUsersDb = (): ServerUsersInStore => ({
    "Foo": {
        salt: '123123',
        verifier: '123',
    }
});
