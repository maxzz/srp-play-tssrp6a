export const onMessages = (e: MessageEvent<string>) => {
    console.log('worker: message from client', e);

    self.postMessage('worker: to client');
};