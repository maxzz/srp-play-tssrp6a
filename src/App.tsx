import { Section2_Main } from "./components/section2_main";
import { Section3_Footer } from "./components/section3-footer";

export function App() {
    return (
        <div className="h-screen grid grid-rows-[1fr,auto] bg-green-50 dark:bg-primary-800">
            <Section2_Main />
            <Section3_Footer />
        </div>
    );
}
