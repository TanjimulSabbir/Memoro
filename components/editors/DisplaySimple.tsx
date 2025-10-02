"use client"

import * as React from "react"

export function DisplaySimple({ value }: { value: string }) {
    return (
        <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 leading-7">
            {value || "No content yet."}
        </div>
    )
}

export default DisplaySimple


