import { proxy, subscribe } from 'valtio';
import { setUiInitialState } from './app-initial-state';
import { mergeDefaultAndLoaded, uuid } from '../utils';
import { ClientUser, ServerUser, initialClientUsersDb } from './srp';

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
        db: ServerUser[];
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
            db: [],
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
    ready.dataState.client.db.forEach((item) => item.uuid = uuid.asRelativeNumber());
    
    return ready;
}

subscribe(appUi.uiState, () => {
    //console.log('store ui  ', appUi.uiState);

    localStorage.setItem(STORAGE_UI_KEY, JSON.stringify({ [STORAGE_UI_VER]: appUi.uiState }));
});

subscribe(appUi.dataState, () => {
    //console.log('store data', appUi.dataState);

    localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify({ [STORAGE_DATA_VER]: appUi.dataState }));
});
