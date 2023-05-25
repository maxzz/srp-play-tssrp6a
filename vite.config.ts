import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'vite-plugin-node-stdlib-browser'

// https://vitejs.dev/config/
export default defineConfig({
    base: '',
    plugins: [
        nodePolyfills(),
        react()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/'),
        }
    },
    server: {
        port: 3000,
    }
});
