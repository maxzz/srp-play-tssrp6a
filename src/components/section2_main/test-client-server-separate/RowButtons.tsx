import { ClientUser, appUi, doSignUpAtom, doSignOutAtom, doSignInAtom } from "@/store";
import { classNames } from "@/utils";
import { useSetAtom } from "jotai";
import { ButtonHTMLAttributes } from "react";
import { INTERNAL_Snapshot, useSnapshot } from "valtio";
import { inputFocusClasses } from "./Rows";

export type MenuState = {

};

export const rowButtonClasses = [
    "bg-primary-100 dark:bg-primary-700 border-state-300 dark:border-primary-600 border rounded shadow active:scale-y-[.97] disabled:opacity-20",
].join(' ');

function RowButton({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className={classNames("px-3 py-[7px] min-w-[70px] text-xs", rowButtonClasses, inputFocusClasses, className)} {...rest} />
    );
}

function RowButtonSignUp({ snap, isSignedIn, ...rest }: { snap: INTERNAL_Snapshot<ClientUser>; isSignedIn: boolean; } & ButtonHTMLAttributes<HTMLButtonElement>) {

    const doSignUp = useSetAtom(doSignUpAtom);
    const doSignOut = useSetAtom(doSignOutAtom);

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

function RowButtonLogIn({ snap, isLoggeddIn, ...rest }: { snap: INTERNAL_Snapshot<ClientUser>; isLoggeddIn: boolean; } & ButtonHTMLAttributes<HTMLButtonElement>) {

    const doLogIn = useSetAtom(doSignInAtom);

    function onLogInClick() {
        doLogIn({ username: snap.username, password: snap.password });
    }

    return (
        <RowButton onClick={onLogInClick} {...rest}>{!isLoggeddIn ? 'Log in' : 'Log out'}</RowButton>
    );
}

export function RowPopupMenu({ item, menuState }: { item: ClientUser; menuState: MenuState; }) {
    const snap = useSnapshot(item);
    const serverDb = useSnapshot(appUi.dataState.server.db);
    const isSignedIn = !!serverDb.get(snap.username);
    const isDisabled = !snap.username.trim() || !snap.password.trim();
    const isLoggeddIn = false;

    return (
        <div className="ml-4 space-x-1">
            <RowButtonSignUp snap={snap} isSignedIn={isSignedIn} disabled={isDisabled} />
            <RowButtonLogIn snap={snap} isLoggeddIn={isLoggeddIn}>Log in</RowButtonLogIn>
        </div>
    );
}

//TODO: validate on empty (and other rules min length, special symbols, and so on) name, password, and show UI hint.
