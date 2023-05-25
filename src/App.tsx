import { Section2_Main } from "./components/section2_main";
import { UIToaster } from "./components/ui/UIToaster";
import { Section3_Footer } from "./components/section3-footer";
import { Sidebar } from "./components/ui/sidebar/Sidebar";

export function App() {
    return (<>
        <UIToaster />
        <div className="h-screen grid grid-rows-[1fr,auto] bg-green-50 dark:bg-primary-800">
            <Section2_Main />
            <Section3_Footer />
            <Sidebar />
        </div>
    </>);
}
