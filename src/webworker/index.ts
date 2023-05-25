import { onServerMessages } from './webworker-server-handlers';

self.addEventListener('message', onServerMessages);
