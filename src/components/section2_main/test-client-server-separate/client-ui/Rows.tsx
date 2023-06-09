import { IconLoggedIn, IconLoggedOut } from "@/components/ui";
import { ClientUser, UserCreds, appUi } from "@/store";
import { classNames, turnOffAutoComplete } from "@/utils";
import { InputHTMLAttributes, Fragment } from "react";
import { useSnapshot } from "valtio";
import { MenuState, RowButtons } from "./RowButtons";
import { inputClasses, focusClasses } from "../../tailwind-shared-classes";

export const dlgBottomButtonClasses = "hover:bg-primary-300 dark:hover:bg-primary-700 border-primary-500 active:scale-[.97] border rounded select-none disabled:opacity-25";

function RowItemInput({ item, name, ...rest }: { item: ClientUser, name: keyof UserCreds; } & InputHTMLAttributes<HTMLInputElement>) {
    const snap = useSnapshot(item, { sync: true });
    return (
        <input
            className={classNames(inputClasses, focusClasses)}
            name={name}
            {...turnOffAutoComplete}
            {...rest}
            value={snap[name]}
            onChange={(e) => { item[name] = e.target.value; }}
            disabled={snap.logged}
        />
    );
}

const gridRowClasses = "grid grid-cols-[auto,1fr,1fr,auto] gap-x-1 items-center select-none";

function RowIcon({ item }: { item: ClientUser; }) {
    const snap = useSnapshot(item);
    const serverDb = useSnapshot(appUi.dataState.server.db);
    const isSignedIn = !!serverDb.get(snap.username);
    const isLoggeddIn = snap.logged;
    const isLoginFailed = snap.loginFailed;
    return (<>
        {isSignedIn
            ? isLoginFailed
                ? < IconLoggedIn className="mr-1 w-6 h-6 text-red-500 stroke-1" />
                : isLoggeddIn
                    ? <IconLoggedIn className="mr-1 w-6 h-6 text-green-500 stroke-1" />
                    : <IconLoggedIn className="mr-1 w-6 h-6 text-primary-500 stroke-1" />
            : <IconLoggedOut className="mr-1 w-6 h-6 text-primary-500 stroke-1" />
        }
    </>);
}

function Row({ item, idx, menuState }: { item: ClientUser; idx: number; menuState: MenuState; }) {
    return (
        <div className={gridRowClasses}>
            <RowIcon item={item} />
            <RowItemInput item={item} name="username" />
            <RowItemInput item={item} name="password" />
            <RowButtons item={item} menuState={menuState} />
        </div>
    );
}

export function GridRows() {
    const items = appUi.dataState.client.db;
    const snap = useSnapshot(items);
    return (
        <div className="grid gap-y-1">
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

//TODO: find all users with the same name
//TODO: check for username duplicates