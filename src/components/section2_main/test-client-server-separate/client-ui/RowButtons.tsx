import { ClientUser, appUi, doSignUpAtom, doSignOutAtom, doLogInAtom, doRemoveUserCredsAtom, doLogOutUserAtom } from "@/store";
import { classNames } from "@/utils";
import { useSetAtom } from "jotai";
import { ButtonHTMLAttributes } from "react";
import { INTERNAL_Snapshot, useSnapshot } from "valtio";
import { focusClasses, rowButtonClasses } from "../../tailwind-shared-classes";
import { IconRemoveUser } from "@/components/ui";
import { toastNotification } from "@/components/ui/UIToaster";

export type MenuState = {

};

function RowButton({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className={classNames("px-3 py-[7px] min-w-[70px] text-xs", rowButtonClasses, focusClasses, className)} {...rest} />
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

    const doLogIn = useSetAtom(doLogInAtom);
    const doLogOutUser = useSetAtom(doLogOutUserAtom);

    async function onLogInClick() {
        if (isLoggeddIn) {
            doLogOutUser({ username: snap.username });
            toastNotification('Logged out', { duration: 3000 });
        } else {
            const res = await doLogIn({ username: snap.username, password: snap.password });
            if (res.error) {
                toastNotification(<div className="-m-4 p-4 w-full text-white bg-red-500">{res.error}</div>, { duration: 3000 });
            } else {
                toastNotification('Established a secure session with the server', { duration: 1000 });
            }
        }
    }

    return (
        <RowButton onClick={onLogInClick} {...rest}>{isLoggeddIn ? 'Log out' : 'Log in'}</RowButton>
    );
}

function ButtonRemoveClientUser({ snap, className, ...rest }: { snap: INTERNAL_Snapshot<ClientUser>; } & ButtonHTMLAttributes<HTMLButtonElement>) {
    const doRemoveUserCreds = useSetAtom(doRemoveUserCredsAtom);

    function onLogInClick() {
        doRemoveUserCreds({ uuid: snap.uuid });
    }

    return (
        <button className={classNames("h-8 aspect-square grid place-items-center text-primary-600 dark:text-primary-400", rowButtonClasses, focusClasses, className)} {...rest} onClick={onLogInClick}>
            <IconRemoveUser className="w-4 h-4" />
        </button>
    );
}

export function RowButtons({ item, menuState }: { item: ClientUser; menuState: MenuState; }) {
    const snap = useSnapshot(item);
    const serverDb = useSnapshot(appUi.dataState.server.db);
    const isSignedIn = !!serverDb.get(snap.username);
    const isDisabled = !snap.username.trim() || !snap.password.trim();
    const isLoggeddIn = !!snap.logged;
    return (
        <div className="ml-4 flex items-center space-x-1">
            <ButtonRemoveClientUser snap={snap} disabled={isDisabled} />
            <RowButtonSignUp snap={snap} isSignedIn={isSignedIn} disabled={isDisabled} />
            <RowButtonLogIn snap={snap} isLoggeddIn={isLoggeddIn} disabled={isDisabled || !isSignedIn}>Log in</RowButtonLogIn>
        </div>
    );
}

//TODO: validate on empty (and other rules min length, special symbols, and so on) name, password, and show UI hint.
