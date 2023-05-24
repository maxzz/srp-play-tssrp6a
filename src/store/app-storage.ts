import { proxy, snapshot, subscribe } from 'valtio';
import { proxyMap } from 'valtio/utils';
import { setUiInitialState } from './app-initial-state';
import { mergeDefaultAndLoaded } from '../utils';
import { ClientUser, ServerUser, ServerUsersMap, ServerUsersInStore, initUserState, initialClientUsersDb, initialServerUsersDb, deserializeServerUsers, serializeServerUsers } from './srp';

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
        }
    }

    let storageData = localStorage.getItem(STORAGE_DATA_KEY);
    if (storageData) {
        try {
            storageData = JSON.parse(storageData)?.[STORAGE_DATA_VER];
        } catch (error) {
        }
    }

    const readyUiState = mergeDefaultAndLoaded({ defaults: initialAppUi.uiState, loaded: storageUi });
    const readyStorageData = mergeDefaultAndLoaded({ defaults: initialAppUi.dataState, loaded: storageData });

    initUserState(readyStorageData.client.db);

    //const ready = mergeDefaultAndLoaded(storeState, initialAppUi);

    const ready: AppUi = {
        uiState: readyUiState,
        dataState: {
            client: {
                db: readyStorageData.client.db,
            },
            server: {
                db: deserializeServerUsers(readyStorageData.server.db)
            },
        }
    }

    console.log('initialize state', ready);

    return ready;
}

subscribe(appUi.uiState, () => {
    //console.log('store ui  ', appUi.uiState);

    localStorage.setItem(STORAGE_UI_KEY, JSON.stringify({ [STORAGE_UI_VER]: appUi.uiState }));
});

subscribe(appUi.dataState, () => {
    console.log('store data', appUi.dataState);

    const snap = snapshot(appUi.dataState);

    const a = [...snap.server.db.entries()];


    const toStore2 = {
        client: snap.client,
        server: {
            db: serializeServerUsers(snap.server.db),
        }
    };

    // const toStore = { ...snapshot(appUi.dataState) };
    // const entries = toStore.server.db.entries();
    // toStore.server.db = Object.fromEntries([...entries].map(([k,v]) => [k,v])) as any;

    localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify({ [STORAGE_DATA_VER]: toStore2 }));
    // localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify({ [STORAGE_DATA_VER]: appUi.dataState }));
});

console.log('server', snapshot(appUi.dataState.server.db));

appUi.dataState.server.db.set("Bar", {
    salt: BigInt('11123'),
    verifier: BigInt('654'),
});