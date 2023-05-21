import { useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { workerAtom } from '@/store';
import { buttonClasses } from '@/components/section2_main';

function createWorker() {
    return new Worker(new URL('./web-worker-body.ts', import.meta.url));
}

export function WebWorkerClient() {
    const [worker, setWorker] = useAtom(workerAtom);

    useEffect(() => {
        const w = createWorker();

        w.postMessage('client: client started');

        w.onmessage = (e: MessageEvent<string>) => {
            console.log('client: message from worker', e);
        };

        setWorker(w);

        return () => {
            w.terminate();
            setWorker(null);
        };
    }, []);

    function onWorkerClick() {
        setWorker((prev) => {
            if (prev) {
                prev.terminate();
                return null;
            } else {
                const w = createWorker();

                w.postMessage('client2: client started');

                w.onmessage = (e: MessageEvent<string>) => {
                    console.log('client2: message from worker', e);
                };

                return w;
            }
        });
    }

    return (
        <div>
            <button className={buttonClasses} onClick={onWorkerClick}>{worker ? 'Stop' : 'Start'}</button>
        </div>
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
