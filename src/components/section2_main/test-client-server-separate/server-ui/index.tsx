import { ButtonHTMLAttributes, HTMLAttributes, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { useSetAtom } from 'jotai';
import { appUi, doSignOutAtom, doSyncDbAtom } from '@/store';
import { focusClasses, rowButtonClasses } from '../../tailwind-shared-classes';
import { IconRemoveUser } from '@/components/ui';
import { classNames } from '@/utils';

const buttonClasses = classNames("h-8 aspect-square grid place-items-center text-primary-600 dark:text-primary-400", rowButtonClasses, focusClasses);

function ButtonRemoveServerUser({ username, className, ...rest }: { username: string; } & ButtonHTMLAttributes<HTMLButtonElement>) {
    const doSignOut = useSetAtom(doSignOutAtom);

    function onLogInClick() {
        doSignOut({ username });
    }

    return (
        <button className={classNames(buttonClasses, focusClasses, className)} {...rest} onClick={onLogInClick}>
            <IconRemoveUser className="w-4 h-4" />
        </button>
    );
}

function ServerUsers() {
    const snap = useSnapshot(appUi.dataState.server.db);
    return (
        <div className="space-y-1">
            {[...snap.keys()].map((username, idx) => (
                <div className="flex items-center space-x-2" key={idx}>
                    <ButtonRemoveServerUser username={username} />
                    <div className="flex-1" >{username}</div>
                    <div className="text-xs opacity-50 justify-self-end">last message</div>
                </div>
            ))}
        </div>
    );
}

export function WebServer({ className, ...rest }: HTMLAttributes<HTMLElement>) {
    const doSyncDb = useSetAtom(doSyncDbAtom);
    useEffect(() => { doSyncDb(); }, []);
    return (
        <div className={classNames("p-4 space-y-2", className)} {...rest}>
            <div className="">Server registered users</div>

            <ServerUsers />
        </div>
    );
}

//TODO: show last message for 1sec for per user
