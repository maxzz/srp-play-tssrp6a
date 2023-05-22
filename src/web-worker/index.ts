import { onMessages } from './web-worker-handlers';

self.onmessage = onMessages;

