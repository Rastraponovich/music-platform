import { fork, Scope, serialize } from "effector"
import { useMemo } from "react"

let clientScope: Scope

function initializeScope(initialState: any) {
    const scope = fork({
        values: {
            ...(clientScope && serialize(clientScope)),
            ...initialState,
        },
    })

    if (typeof window !== "undefined") clientScope = scope

    return scope
}

export function useScope(initialState: any) {
    return useMemo(() => initializeScope(initialState), [initialState])
}
