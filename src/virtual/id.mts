/** Generate virtual vite module id */
export function virtualId(id: string): [virtualModuleId: string, resolvedVirtualModuleId: string] {

	const virtualModuleId = `virtual:${id}`
	const resolvedVirtualModuleId = '\0' + virtualModuleId + '.mts'

	return [virtualModuleId, resolvedVirtualModuleId]
}