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
        <button className={classNames("px-2 py-[7px] min-w-[64px] text-xs", rowButtonClasses, focusClasses, className)} {...rest} />
    );
}

function ButtonRemoveClientUser({ snap, className, ...rest }: { snap: INTERNAL_Snapshot<ClientUser>; } & ButtonHTMLAttributes<HTMLButtonElement>) {
    const doRemoveUserCreds = useSetAtom(doRemoveUserCredsAtom);
    return (
        <button
            className={classNames("h-8 aspect-square grid place-items-center text-primary-600 dark:text-primary-400", rowButtonClasses, focusClasses, className)}
            {...rest} onClick={() => doRemoveUserCreds({ uuid: snap.uuid })}
        >
            <IconRemoveUser className="w-4 h-4" />
        </button>
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

function RowButtonMessage({ item, isLoggeddIn, ...rest }: { item: ClientUser; isLoggeddIn: boolean; } & ButtonHTMLAttributes<HTMLButtonElement>) {
    async function onSendMessageClick() {
    }
    return (
        <RowButton onClick={onSendMessageClick} {...rest} />
    );
}

function RowButtonLogIn({ item, isLoggeddIn, ...rest }: { item: ClientUser; isLoggeddIn: boolean; } & ButtonHTMLAttributes<HTMLButtonElement>) {
    const snap = useSnapshot(item);

    const doLogIn = useSetAtom(doLogInAtom);
    const doLogOutUser = useSetAtom(doLogOutUserAtom);

    async function onLogInClick() {
        if (isLoggeddIn) {
            doLogOutUser({ username: snap.username });
            toastNotification('Logged out', { duration: 3000 });
        } else {
            const res = await doLogIn({ username: snap.username, password: snap.password });
            if (res.error) {
                item.loginFailed = true;
                setTimeout(() => { item.loginFailed = false; }, 3000);
                toastNotification(<div className="-m-4 p-4 w-full text-white bg-red-500">{res.error}</div>, { duration: 3000 });
            } else {
                item.loginFailed = false;
                toastNotification('Established a secure session with the server', { duration: 1000 });
            }
        }
    }

    return (
        <RowButton onClick={onLogInClick} {...rest}>{isLoggeddIn ? 'Log out' : 'Log in'}</RowButton>
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
            <RowButtonLogIn item={item} isLoggeddIn={isLoggeddIn} disabled={isDisabled || !isSignedIn}>Log in</RowButtonLogIn>
            <RowButtonMessage item={item} isLoggeddIn={isLoggeddIn} disabled={isDisabled || !isSignedIn || !isLoggeddIn}>Send message</RowButtonMessage>
        </div>
    );
}

//TODO: validate on empty (and other rules min length, special symbols, and so on) name, password, and show UI hint.
//TODO: send message button