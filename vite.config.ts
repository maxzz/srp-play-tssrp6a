import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';
import visualizer from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
    base: '',
    plugins: [
        nodePolyfills(),
        react(),
        visualizer({
            filename: 'visualization.html',
            template: 'sunburst', // sunburst - d3 style (good as default as well); treemap - table (default); network - graph (slow to open).
            gzipSize: true,
            brotliSize: true,
        }),
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
