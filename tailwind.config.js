const plugin = require("tailwindcss/plugin");
const colors = require('tailwindcss/colors');

const customAdditionsPlugin = plugin(function ({ addComponents }) {
    const newComponents = {
        ".scrollbar-w-2::-webkit-scrollbar": {
            width: ".5rem !important",
            height: ".5rem !important",
        },
        ".scrollbar-thumb-rounded::-webkit-scrollbar-thumb": {
            borderRadius: ".25rem !important",
        },
        ".scrollbar-thumb-gray::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(156, 163, 175, 1) !important",
        },
        ".scrollbar-track-gray-lighter::-webkit-scrollbar-track": {
            backgroundColor: "rgba(209, 213, 219, 1) !important",
        },
        ".scrollbar-thumb-transparent::-webkit-scrollbar-thumb": {
            backgroundColor: "transparent",
        },
        ".scrollbar-track-transparent::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
        },
    };
    addComponents(newComponents, {
        variants: ["responsive"],
    });
});

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{tsx,ts}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: colors.slate,
                // ui: {
                //     bg: colors.slate[100],
                //     text: '#5a3543',
                // },
            },

            // keyframes: {
            //     hide: {
            //         from: { opacity: 1 },
            //         to: { opacity: 0 },
            //     },
            //     slideIn: {
            //         from: { transform: 'translateX(100%)' }, //12px for --viewport-padding
            //         to: { transform: 'translateX(0)' },
            //     },
            //     swipeOut: {
            //         from: { transform: 'translateX(var(12px))' }, //12px for --radix-toast-swipe-end-x
            //         to: { transform: 'translateX(calc(100% + var(12px)))' }, //12px for --viewport-padding
            //     },
            // },
            // animation: {
            //     hide: 'hide 100ms ease-in',
            //     slideIn: 'slideIn 1150ms cubic-bezier(0.16, 1, 0.3, 1)',
            //     swipeOut: 'swipeOut 1100ms ease-out',
            // },

            ...require('./tailwind/tailwind-extra-animations').extraAnimations,
        },
    },
    plugins: [
        customAdditionsPlugin,
        require('./tailwind/tailwnid-plugin-debug-styles'),
        require('./tailwind/tailwind-plugin-debug-screens'),
        require('./tailwind/tailwind-plugin-colors-bridge')([
            { prefix: '--tm-', groupName: 'primary' },
            // { prefix: '--tm-', groupName: 'ui', groupNameOut: 'ui' },
        ]),
        require('./tailwind/tailwind-plugin-overflow-overlay'),
        require('./tailwind/tailwind-plugin-data-state'),
        require('tailwindcss-radix')(),
        require('@tailwindcss/forms')({ strategy: 'class' }),

        require('@tailwindcss/container-queries'),
    ],
};
