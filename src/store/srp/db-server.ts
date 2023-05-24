// In memory

export type ServerUser<T = bigint> = {
    salt: T;
    verifier: T;
};

export type ServerUsersMap = Map<string, ServerUser>;

// In store

type ServerUserInStore = ServerUser<string>;

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

export function deserializeServerUsers(serverUsers: ServerUsersInStore): (readonly [string, ServerUser])[] {
    return [...Object.entries(serverUsers)].map(([k, v]) => [k, deserializeServerUser(v)] as const);
}

// Initialize in InStore format

export const initialServerUsersDb = (): ServerUsersInStore => ({
    // "Foo": {
    //     salt: '123123',
    //     verifier: '123',
    // }
});
