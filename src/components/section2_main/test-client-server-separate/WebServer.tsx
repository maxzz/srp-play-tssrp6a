import { HTMLAttributes } from 'react';
import { WorkerHandlers, WorkerLogin } from './WorkerHandlers';

export function WebServer({ className, ...rest }: HTMLAttributes<HTMLElement>) {
    return (
        <div className={className} {...rest}>
            <div className="mb-2">Worker</div>
            <WorkerHandlers />
            <WorkerLogin />
        </div>
    );
}
