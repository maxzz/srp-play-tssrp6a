import { GridRows } from "./Rows";
import { WebServer } from "./WebServer";
import { classNames } from "@/utils";
import { buttonClasses } from "..";
import { IconAdd, IconLoggedIn, IconLoggedOut } from "@/components/ui";
import { ToastDemo } from "./Toaster";
import { toastWarning } from "@/components/ui/UIToaster";

function AddRowButton() {
    return (
        <button className={classNames("px-1.5 py-1", buttonClasses)}>
            <IconAdd className="w-3 h-3" />
        </button>
    );
}

export function ClientServerSeparate() {
    async function run() {
    }
    return (
        <div className="max-w-[64ch] p-4 text-sm space-y-4">
            <button className={buttonClasses} onClick={async () => { run(); }}>
                Start
            </button>

            <div className="flex items-center space-x-2"><span>Clients</span> <AddRowButton /></div>
            <GridRows />

            <WebServer className="pt-4" />

            <div className="">
                <button className={classNames("px-1.5 py-1", buttonClasses)} onClick={() => {toastWarning('ready')}}>
                    toast
                </button>
            </div>

            <div className="">
                <ToastDemo />
            </div>
        </div>
    );
}
