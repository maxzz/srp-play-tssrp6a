import { ClientUser, appUi } from ".";

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

export function setUserLogged(username: string, logged: boolean) {
    const user = getUser(username);
    user && (user.logged = logged);
}

export function setUsersLogged(username: string, logged: boolean) {
    const users = getUsers(username);
    users.forEach((user) => user.logged = logged);
}
