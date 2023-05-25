import { HTMLAttributes, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { doSyncDbAtom } from '@/store';
import { WorkerHandlers } from './WorkerHandlers';
import { classNames } from '@/utils';

export function WebServer({ className, ...rest }: HTMLAttributes<HTMLElement>) {
    const doSyncDb = useSetAtom(doSyncDbAtom);
    useEffect(() => { doSyncDb(); }, []);
    return (
        <div className={classNames("space-y-2", className)} {...rest}>
            <div className="">Worker</div>
            <WorkerHandlers />
            {/* <WorkerLogin /> */}

            {/* {steps.map((step) => (
                <div className={`${step.className}`}>{step.text}</div>
            ))} */}
        </div>
    );
}
