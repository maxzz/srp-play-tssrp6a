import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { doSigninAtom, workerAtom } from "@/store";
import { buttonClasses } from "..";

export function WorkerHandlers() {
    const worker = useAtomValue(workerAtom);

    useEffect(() => {
        const handleMessages = (e: MessageEvent<string>) => {
            console.log('client: message from worker', e);
        };

        if (worker) {
            //worker.postMessage('client: client started');

            worker.addEventListener('message', handleMessages);
        }

        return () => {
            worker?.removeEventListener('message', handleMessages);
        };
    }, [worker]);

    return null;
}

export function WorkerLogin() {
    const doCallWorker = useSetAtom(doSigninAtom);

    function onWorkerClick() {
        doCallWorker({ username: 'max', password: 'now' });
    }

    return (
        <button className={buttonClasses} onClick={onWorkerClick}>Login</button>
    );
}
