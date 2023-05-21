self.onmessage = (e: MessageEvent<string>) => {
    console.log('ee', e);

    self.postMessage('from web-worker')
}
