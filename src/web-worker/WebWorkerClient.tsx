import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { workerAtom } from '@/store';

// function createWorker() {
//     return new Worker(new URL('./web-worker-body.ts', import.meta.url));
// }

// export function WebWorkerClient() {
//     const setWorker = useSetAtom(workerAtom);

//     useEffect(() => {
//         const worker = createWorker();
//         setWorker(worker);
//         return () => {
//             worker.terminate();
//             setWorker(null);
//         };
//     }, []);

//     return null;
// }
