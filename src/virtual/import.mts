import { LoadResult, ResolveIdResult } from "rollup";
import { virtualId } from "./id.mts";

/** Shorthand for virtual Vite import */
export type VirtualImportResult = [
    resolveId: (id: string | undefined) => ResolveIdResult,
    loadVirtualUrlImport: (id: string) => LoadResult
]

/** Shorthand for virtual Vite import */
export function virtualImport(id: string, importResult: LoadResult): VirtualImportResult {

    const [virtualModuleId, resolvedVirtualModuleId] = virtualId(id)
    const resolveId = (id: string | undefined): ResolveIdResult => {
        if (id === virtualModuleId) {
            return resolvedVirtualModuleId
        }
        return false;
    };

    const loadVirtualUrlImport = (id: string): LoadResult => {
        if (id !== resolvedVirtualModuleId) return void 0;

        return importResult;
    }

    return [resolveId, loadVirtualUrlImport]
}