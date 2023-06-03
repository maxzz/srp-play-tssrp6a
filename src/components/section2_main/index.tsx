import { ClientServerTogether } from "./test-client-server-togrther";
import { ClientServerSeparateBody } from "./test-client-server-separate";
import { ToastWithUITest } from "../ui/UIToaster";

export function Section2_Main() {
    return (
        <div className="mt-2 text-sm text-primary-800 dark:text-primary-300 divide-primary-400 dark:divide-primary-600 divide-y divide-dotted">

            <ClientServerSeparateBody />

            <div className="p-4">
                <ClientServerTogether />
            </div>

            <div className="">
                <div className="max-w-[84ch] flex items-center">
                    <ToastWithUITest />
                </div>
            </div>

            <div />
        </div>
    );
}
//, {duration:2000}