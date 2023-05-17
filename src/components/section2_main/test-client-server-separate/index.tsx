import { Fragment, InputHTMLAttributes } from "react";
import { useSnapshot } from "valtio";
import { buttonClasses } from "..";
import { ClientUser, clientUsersDb } from "../../../store";
import { classNames, turnOffAutoComplete } from "../../../utils";

export const inputClasses = "px-2 py-1.5 w-full text-primary-800 dark:text-primary-300 bg-primary-100 dark:bg-primary-700 rounded";
export const inputFocusClasses = "focus:ring-primary-600 dark:focus:ring-primary-400 focus:ring-offset-primary-200 dark:focus:ring-offset-primary-800 focus:ring-1 focus:ring-offset-1 focus:outline-none";
export const dlgBottomButtonClasses = "hover:bg-primary-300 dark:hover:bg-primary-700 border-primary-500 active:scale-[.97] border rounded select-none disabled:opacity-25";

function RowItemInput({ item, name, ...rest }: { item: ClientUser, name: 'name' | 'password' } & InputHTMLAttributes<HTMLInputElement>) {
    const snap = useSnapshot(item, { sync: true });
    return (
        <input
            className={classNames("px-2 py-1 w-full text-primary-800 bg-primary-50 dark:text-primary-300 dark:bg-primary-700 rounded-sm col-span-full @[300px]:col-span-1", inputFocusClasses)}
            name={name}
            {...turnOffAutoComplete}
            {...rest}
            value={snap[name]}
            onChange={(e) => { item[name] = e.target.value; }}
        />
    );
}

const gridRowClasses = "grid grid-cols-2 @[300px]:grid-cols-[1.5rem_1fr_minmax(auto,130px)_20px] gap-0.5 items-center select-none @[300px]:gap-1";

type MenuState = {

}

function Row({ item, idx, menuState }: { item: ClientUser; idx: number; menuState: MenuState; }) {
    return (
        <div className={gridRowClasses}>
            <RowItemInput item={item} name="name" />
            <RowItemInput item={item} name="password" />
            {/* <RowPopupMenu menuState={menuState} /> */}
        </div>
    );
}

export function GridRows() {
    const items = clientUsersDb;
    const snap = useSnapshot(items);
    return (
        <div className="@container pl-2 pr-[10px] pb-1 text-xs grid gap-y-1">
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

export function ClientServerSeparate() {
    async function run() {
    }
    return (
        <div className="p-4 text-sm space-y-4">
            <button className={buttonClasses} onClick={async () => { run(); }}>
                Start
            </button>

            <GridRows />

            {/* {steps.map((step) => (
                <div className={`${step.className}`}>{step.text}</div>
            ))} */}
        </div>
    );
}
