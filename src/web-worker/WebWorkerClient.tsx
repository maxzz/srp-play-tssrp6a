import { workerAtom } from '@/store';
import { useAtom } from 'jotai';
import React, { useEffect, useMemo } from 'react';

export function WebWorkerClient() {
    const [worker, setWorker] = useAtom(workerAtom);

    useEffect(() => {
        const w = new Worker(new URL('./web-worker-body.ts', import.meta.url));

        w.postMessage('client: client started');

        w.onmessage = (e: MessageEvent<string>) => {
            console.log('client: message from worker', e);
        };

        setWorker(w);

        return () => {
            w.terminate();
            setWorker(null);
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
