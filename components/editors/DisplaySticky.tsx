"use client"

import * as React from "react"

const COLOR_MAP: Record<string, string> = {
    yellow: "bg-yellow-50 dark:bg-yellow-200/10 border-yellow-200 dark:border-yellow-300/30",
    pink: "bg-pink-50 dark:bg-pink-200/10 border-pink-200 dark:border-pink-300/30",
    green: "bg-green-50 dark:bg-green-200/10 border-green-200 dark:border-green-300/30",
    blue: "bg-blue-50 dark:bg-blue-200/10 border-blue-200 dark:border-blue-300/30",
}

export function DisplaySticky({ value, color = 'yellow' }: { value: string, color?: string }) {
    const colorClass = COLOR_MAP[color] ?? COLOR_MAP.yellow
    return (
        <div className={`w-full p-4 border rounded-lg shadow-sm ${colorClass}`}>
            <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 leading-7">
                {value || "No content yet."}
            </div>
        </div>
    )
}

export default DisplaySticky


