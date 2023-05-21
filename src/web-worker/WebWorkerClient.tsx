import React, { useEffect, useMemo } from 'react';

export function WebWorkerClient() {
    const worker = useMemo(() => {
        return new Worker(new URL('./web-worker-body.ts', import.meta.url));
    }, []);

    useEffect(() => {
        if (worker && window.Worker) {
            worker.postMessage('client started');

            worker.onmessage = (e: MessageEvent<string>) => {
                console.log('from worker', e);
            };
        }
    }, [worker]);
    return (
        <div>WebWorkerClient</div>
    );
}
