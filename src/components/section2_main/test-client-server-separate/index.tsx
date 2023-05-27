import { GridRows } from "./Rows";
import { classNames } from "@/utils";
import { buttonClasses } from "..";
import { IconAdd, IconAddUser, IconLoggedIn, IconLoggedOut } from "@/components/ui";

function AddRowButton() {
    return (
        <button className={classNames("px-1 py-1.5", buttonClasses)}>
            <IconAddUser className="w-4 h-4" />
            {/* <IconAdd className="w-3 h-3" /> */}
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
        </div>
    );
}
