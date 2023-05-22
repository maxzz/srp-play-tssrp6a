import { HTMLAttributes } from 'react';
import { WorkerHandlers, WorkerLogin } from './WorkerHandlers';
import { classNames } from '@/utils';

export function WebServer({ className, ...rest }: HTMLAttributes<HTMLElement>) {
    return (
        <div className={classNames("space-y-2", className)} {...rest}>
            <div className="">Worker</div>
            <WorkerHandlers />
            <WorkerLogin />
        </div>
    );
}
