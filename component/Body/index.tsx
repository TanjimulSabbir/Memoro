"use client"

import { useState } from 'react'

export default function TextBody() {
  const [content, setContent] = useState('')

  return (
    <div className="flex-1 p-6 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Note Editor</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your notes here..."
          className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
        />
      </div>
    </div>
  )
}
