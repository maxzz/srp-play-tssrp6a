import { GridRows } from "./Rows";
import { classNames } from "@/utils";
import { buttonClasses } from "..";
import { IconAddUser } from "@/components/ui";
import { appUi, createNewLoginRow } from "@/store";

function AddRowButton() {
    return (
        <button className={classNames("!px-2", buttonClasses)} title="Add user" onClick={() => {
            appUi.dataState.client.db.push(createNewLoginRow({ username: 'new name', password: 'new password' }));
        }}>
            <IconAddUser className="w-5 h-5" />
        </button>
    );
}

export function ClientServerSeparate() {
    return (
        <div className="max-w-[64ch] p-4 text-sm space-y-4">
            <div className="flex items-center justify-between">
                <span>Clients</span>
                <AddRowButton />
            </div>

            <GridRows />
        </div>
    );
}
