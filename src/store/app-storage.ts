import { proxy, snapshot, subscribe } from 'valtio';
import { proxyMap } from 'valtio/utils';
import { setUiInitialState } from './app-initial-state';
import { mergeDefaultAndLoaded } from '../utils';
import { ClientUser, ServerUsersMap, ServerUsersInStore, initUserState, initialClientUsersDb, initialServerUsersDb, deserializeServerUsers, serializeServerUsers } from './srp';

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

setUiInitialState(appUi.uiState);

// Local storage

function loadUiInitialState(): AppUi {
    const storeState = {} as AppUi<ServerUsersInStore>;

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
    }

    initUserState(readyStorageData.client.db);

    const ready: AppUi = {
        uiState: readyUiState,
        dataState: {
            client: {
                db: readyStorageData.client.db,
            },
            server: {
                db: proxyMap(deserializeServerUsers(readyStorageData.server.db))
            },
        }
    }

    return ready;
}

subscribe(appUi.uiState, () => {
    //console.log('store ui  ', appUi.uiState);

    localStorage.setItem(STORAGE_UI_KEY, JSON.stringify({ [STORAGE_UI_VER]: appUi.uiState }));
});

subscribe(appUi.dataState, () => {
    //console.log('store data', appUi.dataState);

    const snap = snapshot(appUi.dataState);
    const toStore = {
        client: snap.client,
        server: {
            db: serializeServerUsers(snap.server.db),
        }
    };

    localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify({ [STORAGE_DATA_VER]: toStore }));
});

// test

console.log('server', snapshot(appUi.dataState.server.db));

// appUi.dataState.server.db.set("Bar", {
//     salt: BigInt('456456'),
//     verifier: BigInt('456'),
// });

// appUi.dataState.server.db.set("Zoo", {
//     salt: BigInt('789789'),
//     verifier: BigInt('789'),
// });
