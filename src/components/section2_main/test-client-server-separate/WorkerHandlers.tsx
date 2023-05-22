import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { workerAtom } from "@/store";
import { buttonClasses } from "..";

export function WorkerHandlers() {
    const worker = useAtomValue(workerAtom);

    useEffect(() => {
        const handleMessages = (e: MessageEvent<string>) => {
            console.log('client: message from worker', e);
        };

        if (worker) {
            worker.postMessage('client: client started');

            worker.addEventListener('message', handleMessages);
        }

        return () => {
            worker?.removeEventListener('message', handleMessages);
        };
    }, [worker]);

    return null;
}

export function WorkerLogin() {
    const worker = useAtomValue(workerAtom);
    
    function onWorkerClick() {
        worker.postMessage('any');
    }
    
    return (
        <button className={buttonClasses} onClick={onWorkerClick}>Login</button>
    )
}
