"use client"

import * as React from "react"
import dynamic from "next/dynamic"

// MDXEditor must be dynamically imported client-side
const MDXEditor = dynamic(async () => (await import("@mdxeditor/editor")).MDXEditor, { ssr: false })
const toolbarPlugin = dynamic(async () => (await import("@mdxeditor/editor")).toolbarPlugin, { ssr: false })
const headingsPlugin = dynamic(async () => (await import("@mdxeditor/editor")).headingsPlugin, { ssr: false })
const listsPlugin = dynamic(async () => (await import("@mdxeditor/editor")).listsPlugin, { ssr: false })
const quotePlugin = dynamic(async () => (await import("@mdxeditor/editor")).quotePlugin, { ssr: false })
const linkPlugin = dynamic(async () => (await import("@mdxeditor/editor")).linkPlugin, { ssr: false })
const markdownShortcutPlugin = dynamic(async () => (await import("@mdxeditor/editor")).markdownShortcutPlugin, { ssr: false })

type Props = {
    value: string
    onChange: (v: string) => void
}

export function MdxEditor({ value, onChange }: Props) {
    // Avoid hydration mismatch
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])
    if (!mounted) return null

    return (
        <div className="prose dark:prose-invert max-w-none">
            {/* @ts-ignore dynamic plugin invocation */}
            <MDXEditor
                markdown={value}
                onChange={onChange}
                plugins={[
          /* @ts-ignore */ toolbarPlugin(),
          /* @ts-ignore */ headingsPlugin(),
          /* @ts-ignore */ listsPlugin(),
          /* @ts-ignore */ quotePlugin(),
          /* @ts-ignore */ linkPlugin(),
          /* @ts-ignore */ markdownShortcutPlugin(),
                ]}
            />
        </div>
    )
}

export default MdxEditor


