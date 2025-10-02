"use client"

import * as React from "react"

type Props = {
    value: string
    onChange: (v: string) => void
    onKeyDown?: (e: React.KeyboardEvent) => void
}

// Minimal Notion-like textarea with large title and body, plain-text for now
export function NotionLikeEditor({ value, onChange, onKeyDown }: Props) {
    const [title, setTitle] = React.useState("")
    const [body, setBody] = React.useState("")

    React.useEffect(() => {
        // Split first line as title, rest as body for simple experience
        const firstBreak = value.indexOf("\n")
        if (firstBreak === -1) {
            setTitle(value)
            setBody("")
        } else {
            setTitle(value.slice(0, firstBreak))
            setBody(value.slice(firstBreak + 1))
        }
    }, [value])

    const update = (newTitle: string, newBody: string) => {
        onChange(newTitle + (newBody ? "\n" + newBody : ""))
    }

    return (
        <div className="space-y-3">
            <input
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value)
                    update(e.target.value, body)
                }}
                onKeyDown={onKeyDown}
                placeholder="Untitled"
                className="w-full bg-transparent outline-none text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <textarea
                value={body}
                onChange={(e) => {
                    setBody(e.target.value)
                    update(title, e.target.value)
                }}
                onKeyDown={onKeyDown}
                placeholder="Type '/' for commands (coming soon)"
                className="w-full h-80 bg-transparent outline-none resize-none text-base leading-7 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
        </div>
    )
}

export default NotionLikeEditor


