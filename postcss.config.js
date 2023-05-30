export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
        ...(process.env.NODE_ENV === 'build' ? { cssnano: { preset: 'default' } } : {}),
    },
};
