import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    envDir: '.',
    resolve: {
        alias: {
            src: '/src',
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import'],
            },
        },
    },
});
