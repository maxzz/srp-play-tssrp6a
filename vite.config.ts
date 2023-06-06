import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';
import visualizer from 'rollup-plugin-visualizer';
//import replace from '@rollup/plugin-replace';

const buildAt = () => {
    const d = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
};

const buildVersion = () => {
    const d = new Date();
    return `${d.getFullYear().toString().substring(3)}.${d.getMonth() + 1}${d.getDate()} (${d.getHours()}${d.getMinutes()})`;
};

// https://vitejs.dev/config/
export default defineConfig({
    base: '',
    plugins: [
        nodePolyfills(),
        react(),
        // replace({
        //     values: {
        //         __BUILD_DATE__: buildAt(),
        //         __BUILD_VER__: buildVersion(),
        //     },
        //     preventAssignment: true,
        // }),
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
