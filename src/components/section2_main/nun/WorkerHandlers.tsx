import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { workerAtom } from "@/store";

export function WorkerHandlers() {
    const worker = useAtomValue(workerAtom);

    useEffect(() => {
        const handleMessages = (e: MessageEvent<string>) => {
            console.log('CLIENT: MESSAGE FROM WORKER, react', e);
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

// export function WorkerSignUp({ ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
//     const doCallWorker = useSetAtom(doSignUpAtom);

//     function onWorkerClick() {
//         doCallWorker({ username: 'max', password: 'now' });
//     }

//     return (
//         <RowButton onClick={onWorkerClick} {...rest}>SignUp</RowButton>
//     );
// }

// export function WorkerLogin({ ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
//     const doCallWorker = useSetAtom(doSignInAtom);

//     function onWorkerClick() {
//         doCallWorker({ username: 'max', password: 'now' });
//     }

//     return (
//         <button className={buttonClasses} onClick={onWorkerClick} {...rest}>Login</button>
//     );
// }
