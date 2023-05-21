import React, { useEffect, useMemo } from 'react';

export function WebWorkerClient() {
    useEffect(() => {
        const worker = new Worker(new URL('./web-worker-body.ts', import.meta.url));

        worker.postMessage('client: client started');

        worker.onmessage = (e: MessageEvent<string>) => {
            console.log('client: message from worker', e);
        };

        return () => {
            worker.terminate();
        }
    }, []);

    return (
        <div>WebWorkerClient</div>
    );
}

export function WebWorkerClient2() {
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
