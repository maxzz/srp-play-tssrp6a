import { ButtonHTMLAttributes, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { doLogInAtom, doSignUpAtom, workerAtom } from "@/store";
import { buttonClasses } from "..";
//import { RowButton } from ".";

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
