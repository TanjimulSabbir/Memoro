"use client"

import * as React from "react"

type Props = {
    value: string
    onChange: (v: string) => void
    onKeyDown?: (e: React.KeyboardEvent) => void
    color?: string
}

const COLOR_MAP: Record<string, string> = {
    yellow: "bg-yellow-100 dark:bg-yellow-200/20 border-yellow-300 dark:border-yellow-300/40",
    pink: "bg-pink-100 dark:bg-pink-200/20 border-pink-300 dark:border-pink-300/40",
    green: "bg-green-100 dark:bg-green-200/20 border-green-300 dark:border-green-300/40",
    blue: "bg-blue-100 dark:bg-blue-200/20 border-blue-300 dark:border-blue-300/40",
}

export function StickyEditor({ value, onChange, onKeyDown, color = "yellow" }: Props) {
    const colorClass = COLOR_MAP[color] ?? COLOR_MAP.yellow

    return (
        <div className="relative">
            <div className={`w-full h-96 p-4 border rounded-lg shadow-sm ${colorClass} transition-colors`}>
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Write a quick note..."
                    className="w-full h-full bg-transparent outline-none resize-none text-gray-900 dark:text-gray-100 placeholder-gray-700/80 dark:placeholder-gray-300/60"
                />
            </div>
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-300/70 dark:bg-yellow-300/40 rotate-12 rounded-sm" />
        </div>
    )
}

export default StickyEditor


