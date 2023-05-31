import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

// https://vitejs.dev/config/
export default defineConfig({
    base: '',
    plugins: [
        nodePolyfills(),
        react()
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    "stdlib": ["node-stdlib-browser"],
                    "ts-srp6a": ["tssrp6a"],
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/'),
        }
    },
    server: {
        port: 3000,
    }
});
