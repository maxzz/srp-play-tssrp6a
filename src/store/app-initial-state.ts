import { UiState } from "./app-storage";

export function setAppDarkMode(isDark: boolean) {
    document.getElementsByTagName('body')[0].classList[isDark ? 'add': 'remove']('dark');
}

export function setUiInitialState(initialUiState: UiState) {
    setAppDarkMode(initialUiState.darkMode);
}
