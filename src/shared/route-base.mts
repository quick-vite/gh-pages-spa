// @ts-expect-error
const routeBase: () => string = () => typeof __routeBase__ === undefined ? import.meta.env.__routeBase__ : __routeBase__;
export { routeBase };