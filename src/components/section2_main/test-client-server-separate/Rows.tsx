import { IconLoggedOut } from "@/components/ui";
import { ClientUser, UserCreds, appUi } from "@/store";
import { classNames, turnOffAutoComplete } from "@/utils";
import { InputHTMLAttributes, Fragment } from "react";
import { useSnapshot } from "valtio";
import { MenuState, RowPopupMenu } from "./RowButtons";

export const inputClasses = [
    "px-2 py-1.5 w-full rounded",
    "text-primary-800 dark:text-primary-300 bg-primary-100 dark:bg-primary-700",
].join(' ');
export const inputFocusClasses = "focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-primary-200 dark:focus:ring-offset-primary-800 focus:ring-1 focus:ring-offset-1 focus:outline-none";
export const dlgBottomButtonClasses = "hover:bg-primary-300 dark:hover:bg-primary-700 border-primary-500 active:scale-[.97] border rounded select-none disabled:opacity-25";

function RowItemInput({ item, name, ...rest }: { item: ClientUser, name: keyof UserCreds; } & InputHTMLAttributes<HTMLInputElement>) {
    const snap = useSnapshot(item, { sync: true });
    return (
        <input
            className={classNames(inputClasses, inputFocusClasses)}
            name={name}
            {...turnOffAutoComplete}
            {...rest}
            value={snap[name]}
            onChange={(e) => { item[name] = e.target.value; }}
        />
    );
}

const gridRowClasses = "grid grid-cols-[auto,1fr,1fr,auto] gap-x-1 items-center select-none";

function Row({ item, idx, menuState }: { item: ClientUser; idx: number; menuState: MenuState; }) {
    return (
        <div className={gridRowClasses}>
            <IconLoggedOut className="mr-1 w-6 h-6 text-primary-500 stroke-1" />
            <RowItemInput item={item} name="username" />
            <RowItemInput item={item} name="password" />
            <RowPopupMenu item={item} menuState={menuState} />
        </div>
    );
}

export function GridRows() {
    const items = appUi.dataState.client.db;
    const snap = useSnapshot(items);
    return (
        <div className="grid gap-y-1">
            {/* <TableHeader /> */}

            {snap.map((item, idx) => {
                const menuState: MenuState = {
                };
                return (
                    <Fragment key={item.uuid}>
                        <Row item={items[idx]} idx={idx} menuState={menuState} key={item.uuid} />
                    </Fragment>
                );
            })}
        </div>
    );
}
