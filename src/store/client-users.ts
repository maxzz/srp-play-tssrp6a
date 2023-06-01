import { ClientUser, UserCreds, appUi } from ".";

export function getUser(username: string): ClientUser | undefined {
    const clientDb = appUi.dataState.client.db;
    const user = clientDb.find((user) => user.username === username);
    return user;
}

export function getUsers(username: string): ClientUser[] {
    const clientDb = appUi.dataState.client.db;
    const users = clientDb.filter((user) => user.username === username);
    return users;
}

// export function setUserLogged(username: string, logged: boolean) {
//     const user = getUser(username);
//     user && (user.logged = logged);
// }

export function setUsersLoggedOut(username: string): ClientUser[] {
    const users = getUsers(username);
    users.forEach((user) => user.logged = false);
    return users;
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
