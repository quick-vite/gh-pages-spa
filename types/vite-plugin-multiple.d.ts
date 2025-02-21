
declare module 'vite-plugin-multiple' {

    type multiple = typeof import('../node_modules/vite-plugin-multiple/types/index.d.ts').default // eslint-disable-line 1254
    const multiple: multiple
    export default multiple
}