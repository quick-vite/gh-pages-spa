import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';

export default defineConfig({
    define: {
        // This is so we can use the import.meta stuff from library context
        'import_meta': 'import.meta'
    },
    resolve: {
        preserveSymlinks: true,
    },
    plugins: [
        dts({
            tsconfigPath: "./tsconfig.json",
            // This doesn't seem to work when the entries have the same filename
            rollupTypes: false,
            // Necessary for virtual imports
            copyDtsFiles: true,
            include: [
                './src/**'
            ],
            exclude: [
                'vite.config.mts'
            ]
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
                'github-pages-config': './src/github-pages-config/_module.mts',
                'github-pages-imports': './src/github-pages-imports/_module.mts',
            }
        }
    }
});