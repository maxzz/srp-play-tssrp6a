import { UiState } from "./app-local-storage";

export function setAppDarkMode(isDark: boolean) {
    document.getElementsByTagName('body')[0].classList[isDark ? 'add': 'remove']('dark');
}

export function initializeUiState(initialUiState: UiState) {
    setAppDarkMode(initialUiState.darkMode);
}
