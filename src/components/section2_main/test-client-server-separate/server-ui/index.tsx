import { HTMLAttributes, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { appUi, doSyncDbAtom } from '@/store';
import { WorkerHandlers } from '../../nun/WorkerHandlers';
import { classNames } from '@/utils';
import { useSnapshot } from 'valtio';

function ServerUsers() {
    const snap = useSnapshot(appUi.dataState.server.db);
    return (
        <div className="">
            {[...snap.keys()].map((username, idx) => (
                <div className="" key={idx}>{username}</div>
            ))}
        </div>
    );
}

export function WebServer({ className, ...rest }: HTMLAttributes<HTMLElement>) {
    const doSyncDb = useSetAtom(doSyncDbAtom);
    useEffect(() => { doSyncDb(); }, []);
    return (
        <div className={classNames("space-y-2", className)} {...rest}>
            <div className="">Server records</div>

            <ServerUsers />

            {/* <WorkerHandlers /> */}

            {/* <WorkerLogin /> */}

            {/* {steps.map((step) => (
                <div className={`${step.className}`}>{step.text}</div>
            ))} */}
        </div>
    );
}

//TODO: show registered users list
