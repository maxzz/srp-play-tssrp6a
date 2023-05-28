import { ClientServerTogether } from "./test-client-server-togrther";
import { ClientServerSeparate } from "./test-client-server-separate";
import { WebServer } from "./test-client-server-separate/WebServer";
import { classNames } from "@/utils";
import { toastTw } from "../ui/UIToaster";

export const buttonClasses = "px-3 py-1.5 bg-primary-100 dark:bg-primary-700 border-state-300 dark:border-primary-500 border rounded shadow active:scale-y-95";

export function Section2_Main() {
    return (
        <div className="text-sm text-primary-800 dark:text-primary-300 divide-y divide-dotted divide-primary-300">

            <div className="p-4">
                <ClientServerTogether />
            </div>

            <div className="">
                <ClientServerSeparate />
            </div>

            <div className="p-4">
                <WebServer />
            </div>

            <div className="p-4">
                <button className={classNames("px-1.5 py-1", buttonClasses)} onClick={() => { toastTw('ready'); }}>
                    show toast
                </button>
            </div>

            <div />
        </div>
    );
}
