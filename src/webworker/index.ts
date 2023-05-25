import { onServerMessages } from './webworker-server-handlers';

import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

self.addEventListener('message', onServerMessages);
