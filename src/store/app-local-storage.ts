import { proxy, snapshot, subscribe } from 'valtio';
import { proxyMap } from 'valtio/utils';
import { initializeUiState } from './app-initial-state';
import { mergeDefaultAndLoaded } from '../utils';
import { ClientUser, ServerUsersMap, ServerUsersInStore, initUserState, initialClientUsersDb, initialServerUsersDb, IOServer, IOClient } from './srp';

const STORAGE_UI_KEY = 'srp-play-tssrp6a:ui';
const STORAGE_DATA_KEY = 'srp-play-tssrp6a:data';
const STORAGE_UI_VER = 'v1';
const STORAGE_DATA_VER = 'v1';

export type UiState = {
    darkMode: boolean;
};

export type DataState<T> = {
    client: {
        db: ClientUser[];
    },
    server: {
        db: T;
    },
};

export type DataStateInStore = DataState<ServerUsersInStore>;

type AppUi<T = ServerUsersMap> = {
    uiState: UiState,
    dataState: DataState<T>;
};

const initialAppUi: AppUi<ServerUsersInStore> = {
    uiState: {
        darkMode: false,
    },
    dataState: {
        client: {
            db: initialClientUsersDb(),
        },
        server: {
            db: initialServerUsersDb(),
        },
    }
};

export const appUi = proxy<AppUi>(loadUiInitialState());

initializeUiState(appUi.uiState);

// Local storage

function loadUiInitialState(): AppUi {
    let storageUi;
    let storageUiStr = localStorage.getItem(STORAGE_UI_KEY);
    if (storageUiStr) {
        try {
            storageUi = JSON.parse(storageUiStr)?.[STORAGE_UI_VER];
        } catch (error) {
            console.error('storageUi bad format');
        }
    }

    let storageData: DataState<ServerUsersInStore> | undefined;
    let storageDataStr = localStorage.getItem(STORAGE_DATA_KEY);
    if (storageDataStr) {
        try {
            storageData = JSON.parse(storageDataStr)?.[STORAGE_DATA_VER] as DataState<ServerUsersInStore>;
        } catch (error) {
            console.error('storageData bad format');
        }
    }

    const readyUiState = mergeDefaultAndLoaded({ defaults: initialAppUi.uiState, loaded: storageUi });
    const readyStorageData = {
        client: mergeDefaultAndLoaded({ defaults: initialAppUi.dataState.client, loaded: storageData?.client }),
        server: mergeDefaultAndLoaded({ defaults: initialAppUi.dataState.server, loaded: storageData?.server }),
    };

    initUserState(readyStorageData.client.db);

    const ready: AppUi = {
        uiState: readyUiState,
        dataState: {
            client: {
                db: readyStorageData.client.db,
            },
            server: {
                db: proxyMap(IOServer.deserializeServerUsers(readyStorageData.server.db)),
            },
        }
    };

    return ready;
}

subscribe(appUi.uiState, () => {
    //console.log('store ui  ', appUi.uiState);

    localStorage.setItem(STORAGE_UI_KEY, JSON.stringify({ [STORAGE_UI_VER]: appUi.uiState }));
});

subscribe(appUi.dataState, () => {
    console.log('store data', appUi.dataState);

    const snap = snapshot(appUi.dataState);
    const toStore = {
        client: {
            db: IOClient.serializeForLoaclstoreServerUser(snap.client.db),
        },
        server: {
            db: IOServer.serializeServerUsers(snap.server.db),
        }
    };

    localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify({ [STORAGE_DATA_VER]: toStore }));
});

//

export function getUser(username: string): ClientUser | undefined {
    const snapClientDb = appUi.dataState.client.db;
    const user = snapClientDb.find((user) => user.username === username);
    return user;
}

// export function getUsers(username: string): ClientUser[] {
//     const snapClientDb = appUi.dataState.client.db;
//     const usersIdxs = snapshot(snapClientDb).map((user, idx) => user.username === username ? idx : -1);
//     const users = usersIdxs.map((userIdx) => userIdx === -1 ? undefined : snapClientDb[userIdx]).filter(Boolean);
//     return users;
// }

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
    console.log('------------ users db', appUi.dataState.client);
    //console.log('------------ users db', logged, [...users]);
    // users.forEach((user) => user.logged = logged);
    users.forEach((user) => {
        console.log('+++ user', user, 'set', logged);
        user.logged = logged;
        console.log('+++ user now', user, 'set', logged);
    });
}
