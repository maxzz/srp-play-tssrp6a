import { ClientServerTogether } from "./test-client-server-togrther";
import { ClientServerSeparate, WebServer } from "./test-client-server-separate";
import { ToastWithUITest } from "../ui/UIToaster";

export function Section2_Main() {
    return (
        <div className="mt-2 text-sm text-primary-800 dark:text-primary-300 divide-primary-400 dark:divide-primary-600 divide-y divide-dotted">

            <div className="p-4 relative">
                <div className="absolute left-8 top-1 px-2 text-primary-400 dark:text-primary-600 bg-primary-100 dark:bg-primary-800">SRP</div>

                <div className="max-w-[84ch] border-primary-300 dark:border-primary-700 divide-primary-300 dark:divide-primary-700 rounded-md border border-solid divide-y dark:divide-y">
                    <div className="">
                        <div className="">
                            <ClientServerSeparate />
                        </div>
                    </div>

                    <div className="">
                        <div className="">
                            <WebServer />
                        </div>
                    </div>
                </div>
            </div>

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