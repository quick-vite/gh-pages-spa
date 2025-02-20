import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';

export default defineConfig({
    define: {
        'import_meta': 'import.meta'
    },
    resolve: {
        preserveSymlinks: true,
    },
    plugins: [
        dts({
            entryRoot: './src'
        }),
    ],
    esbuild: {
        minifyIdentifiers: false,
        keepNames: true
    },
    build: {
        target: 'esnext',
        ssr: true,
        sourcemap: true,
        rollupOptions: {
            output: {
                esModule: true,
            },
            external: [
                /^vite/,
            ]
        },
        lib: {
            formats: ['es'],
            entry: {
                'github-pages-config': './src/github-pages-config.mts',
                'github-pages-imports': './src/github-pages-imports.mts',
            }
        }
    }
});