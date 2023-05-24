export function onServerMessages({ data }: MessageEvent<string>) {
    console.log('worker: message from client', data);

    self.postMessage('worker: to client');
}
