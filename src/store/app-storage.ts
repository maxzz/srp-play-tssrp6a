import { proxy, subscribe } from 'valtio';
import { proxyMap } from 'valtio/utils';
import { setUiInitialState } from './app-initial-state';
import { mergeDefaultAndLoaded } from '../utils';
import { ClientUser, ServerUser, ServerUsers, initUserState, initialClientUsersDb, initialServerUsersDb } from './srp';

const STORAGE_UI_KEY = 'srp-play-tssrp6a:ui';
const STORAGE_DATA_KEY = 'srp-play-tssrp6a:data';
const STORAGE_UI_VER = 'v1';
const STORAGE_DATA_VER = 'v1';

export type UiState = {
    darkMode: boolean;
};

export type DataState = {
    client: {
        db: ClientUser[];
    },
    server: {
        db: Map<string, ServerUser>;
    },
};

type AppUi = {
    uiState: UiState,
    dataState: DataState;
};

const initialAppUi: AppUi = {
    uiState: {
        darkMode: false,
    },
    dataState: {
        client: {
            db: initialClientUsersDb(),
        },
        server: {
            // db: proxyMap<string, ServerUser>(),
            db: proxyMap(Object.entries(initialServerUsersDb())),
        },
    }
};

export const appUi = proxy<AppUi>(loadUiInitialState());

setUiInitialState(appUi.uiState);

// Local storage

function loadUiInitialState(): AppUi {
    const storeState = {} as AppUi;

    const storageUi = localStorage.getItem(STORAGE_UI_KEY);
    if (storageUi) {
        try {
            storeState.uiState = JSON.parse(storageUi)?.[STORAGE_UI_VER];
        } catch (error) {
        }
    }

    const storageData = localStorage.getItem(STORAGE_DATA_KEY);
    if (storageData) {
        try {
            storeState.dataState = JSON.parse(storageData)?.[STORAGE_DATA_VER];
        } catch (error) {
        }
    }

    const ready = mergeDefaultAndLoaded(storeState, initialAppUi);

    initUserState(ready.dataState.client.db);

    ready.dataState.server.db = proxyMap(Object.entries(ready.dataState.server.db));

    return ready;
}

subscribe(appUi.uiState, () => {
    //console.log('store ui  ', appUi.uiState);

    localStorage.setItem(STORAGE_UI_KEY, JSON.stringify({ [STORAGE_UI_VER]: appUi.uiState }));
});

subscribe(appUi.dataState, () => {
    console.log('store data', appUi.dataState);

    localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify({ [STORAGE_DATA_VER]: appUi.dataState }));
});

appUi.dataState.server.db.set("Bar", {
    salt: BigInt('11123'),
    verifier: BigInt('654'),
});