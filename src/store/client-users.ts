import { ClientUser, UserCreds, appUi } from ".";

export function getUser(username: string): ClientUser | undefined {
    const snapClientDb = appUi.dataState.client.db;
    const user = snapClientDb.find((user) => user.username === username);
    return user;
}

export function getUsers(username: string): ClientUser[] {
    const snapClientDb = appUi.dataState.client.db;
    const users = snapClientDb.filter((user) => user.username === username);
    return users;
}

// export function setUserLogged(username: string, logged: boolean) {
//     const user = getUser(username);
//     user && (user.logged = logged);
// }

export function setUsersLogged(username: string, logged: boolean) {
    const users = getUsers(username);
    users.forEach((user) => user.logged = logged);
}

export function setUsersSessionKeys(userCreds: UserCreds, sk?: { iv: bigint; sk: bigint; } | false) {
    const users = getUsers(userCreds.username);
    users.forEach((user) => {
        if (user.password === userCreds.password) {
            if (sk) {
                user.logged = true;
                user.iv = sk.iv;
                user.sk = sk.sk;
            } else {
                user.logged = false;
            }
        }
    });
}
