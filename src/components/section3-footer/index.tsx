import { useSnapshot } from "valtio";
import { appUi, setAppDarkMode } from "@/store";
import { DarkLightSwitch, IconSunnyvale } from "@/components/ui";

// function ShowVjButton() {
//     const { pageVjDlgOpen } = useSnapshot(appUi.uiState);
//     return (
//         <button className="absolute left-3 px-2 py-1 text-xs border-primary-600 border rounded" onClick={() => { appUi.uiState.pageVjDlgOpen = !pageVjDlgOpen; }}>
//             {pageVjDlgOpen ? 'Close' : 'Open'} Dialog
//         </button>
//     );
// }

function ColorModeSwitch() {
    const { darkMode } = useSnapshot(appUi.uiState);

    function changeMode() {
        appUi.uiState.darkMode = !darkMode;
        setAppDarkMode(!darkMode);
    }

    return (
        <DarkLightSwitch className="absolute right-3 w-4 h-4 cursor-pointer" isDark={darkMode} title="Light/Dark Mode Switch" onClick={changeMode} />
    );
}

export function Section3_Footer() {
    return (
        <div className="px-2 py-2 text-primary-700 dark:text-primary-500 bg-primary-300/50 dark:bg-primary-900 select-none flex items-center justify-center space-x-2 relative">
            {/* <ShowVjButton /> */}

            <a href="https://github.com/maxzz/reactivity-valtio-jotai" target="_blank" >
                <IconSunnyvale className="w-4 h-4 text-primary-500 dark:text-primary-600" />
            </a>

            <ColorModeSwitch />
        </div>
    );
}
