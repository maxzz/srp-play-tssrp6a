import { ClientUser, appUi, doSignUpAtom, doSignOutAtom } from "@/store";
import { classNames } from "@/utils";
import { useSetAtom } from "jotai";
import { ButtonHTMLAttributes } from "react";
import { useSnapshot } from "valtio";
import { inputFocusClasses } from "./Rows";

export type MenuState = {

};

const rowButtonClasses = [
    "bg-primary-100 dark:bg-primary-700 border-state-300 dark:border-primary-600 border rounded shadow active:scale-y-[.97]",
].join(' ');

function RowButton({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className={classNames("px-3 py-[7px] min-w-[70px] text-xs", rowButtonClasses, inputFocusClasses, className)} {...rest} />
    );
}

function RowButtonSignUp({ item, ...rest }: { item: ClientUser; } & ButtonHTMLAttributes<HTMLButtonElement>) {
    const snap = useSnapshot(item);
    const serverDb = useSnapshot(appUi.dataState.server.db);

    const doSignUp = useSetAtom(doSignUpAtom);
    const doSignOut = useSetAtom(doSignOutAtom);

    const isSignedIn = !!serverDb.get(snap.username);

    function onSignUpClick() {
        doSignUp({ username: snap.username, password: snap.password });
    }

    function onSignOutClick() {
        doSignOut({ username: snap.username });
    }

    return (
        <RowButton onClick={isSignedIn ? onSignOutClick : onSignUpClick} {...rest}>{isSignedIn ? 'Sign out' : 'Sign up'}</RowButton>
    );
}

export function RowPopupMenu({ item, menuState }: { item: ClientUser; menuState: MenuState; }) {
    return (
        <div className="ml-4 space-x-1">
            <RowButtonSignUp item={item} />
            {/* <RowButton>Log in</RowButton> */}
            <RowButton>Log out</RowButton>
        </div>
    );
}

//TODO: validate on empty (and other rules min length, special symbols, and so on) name, password, and show UI hint.
