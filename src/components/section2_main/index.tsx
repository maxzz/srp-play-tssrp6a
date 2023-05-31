import { ClientServerTogether } from "./test-client-server-togrther";
import { ClientServerSeparate, WebServer } from "./test-client-server-separate";
import { classNames } from "@/utils";
import { toastNotification } from "../ui/UIToaster";
import { HeadlessToastTest } from "../ui/UIToasterHeadless";
import { ToastWithUITest } from "../ui/UIToasterWithUI";

export const buttonClasses = "px-3 py-1.5 bg-primary-100 dark:bg-primary-700 border-state-300 dark:border-primary-500 border rounded shadow active:scale-y-95";

export function Section2_Main() {
    return (
        <div className="text-sm text-primary-800 dark:text-primary-300 divide-y divide-dotted divide-primary-300">

            <div className="p-4">
                <ClientServerTogether />
            </div>

            <div className="">
                <div className="max-w-[84ch]">
                    <ClientServerSeparate />
                </div>
            </div>

            <div className="">
                <div className="max-w-[84ch]">
                    <WebServer />
                </div>
            </div>

            <div className="">
                <div className="max-w-[84ch] flex items-center">
                    <HeadlessToastTest />
                    <ToastWithUITest />
                </div>
            </div>

            <div />
        </div>
    );
}
//, {duration:2000}