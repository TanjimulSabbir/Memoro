"use client"

import * as React from "react"

export function DisplayNotionLike({ value }: { value: string }) {
    const [title, body] = React.useMemo(() => {
        const idx = value.indexOf("\n")
        if (idx === -1) return [value, ""]
        return [value.slice(0, idx), value.slice(idx + 1)]
    }, [value])

    return (
        <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                {title || "Untitled"}
            </h1>
            <div className="whitespace-pre-wrap text-base leading-7 text-gray-800 dark:text-gray-200">
                {body || ""}
            </div>
        </div>
    )
}

export default DisplayNotionLike


