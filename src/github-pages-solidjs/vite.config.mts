import path from "node:path";
import { defineConfig, normalizePath } from "vite";
import dts from 'vite-plugin-dts';
import solid from 'vite-plugin-solid'
import stringReplace from 'vite-plugin-string-replace'

export default defineConfig({
    define: {
        // This is so we can use the import.meta stuff from library context
        'import_meta': 'import.meta'
    },
    resolve: {
        preserveSymlinks: true,
    },
    plugins: [
        solid(),
        // Revert JSR compat fix
        stringReplace([{
            search: 'file:@quick-vite/gh-pages-spa/route-base',
            replace: 'virtual:@quick-vite/gh-pages-spa/route-base'
        }]),
        dts({
            tsconfigPath: "./tsconfig.json",
            // This doesn't seem to work when the entries have the same filename
            rollupTypes: false,
            // Necessary for virtual imports
            copyDtsFiles: true,
            outDir: normalizePath(path.resolve(__dirname, '../../dist/github-pages-solidjs')),
            entryRoot: normalizePath(path.resolve(__dirname, './src/')),
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
                /^solid-js/,
                /^@solidjs/,
                /^vite/,
                /^virtual:/,
            ]
        },
        outDir: normalizePath(path.resolve(__dirname, '../../dist')),
        emptyOutDir: false,
        lib: {
            formats: ['es'],
            entry: {
                'github-pages-solidjs':  normalizePath(path.resolve(__dirname, './src/_module.mts')),
            }
        }
    }
});