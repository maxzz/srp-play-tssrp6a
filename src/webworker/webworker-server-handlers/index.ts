import { onMessagesFromClient } from './webworker-server-handlers';

self.addEventListener('message', onMessagesFromClient);
