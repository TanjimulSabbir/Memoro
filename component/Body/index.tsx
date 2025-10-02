"use client"

import { useEffect, useRef, useState } from 'react'
import { useFile } from '@/contexts/file-context'
import { db } from '@/db/db'
import { Button } from '@/components/ui/button'
import { Save, FileText, Check, Loader2, StickyNote, Pencil, Eye, Code2 } from 'lucide-react'
import { SimpleEditor } from '@/components/editors/SimpleEditor'
import { StickyEditor } from '@/components/editors/StickyEditor'
import { MdxEditor } from '@/components/editors/MdxEditor'
import { DisplaySimple } from '@/components/editors/DisplaySimple'
import { DisplaySticky } from '@/components/editors/DisplaySticky'

export default function TextBody() {
  const { selectedFile, fileContent, setFileContent, isEditing, setIsEditing } = useFile()
  const [localContent, setLocalContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [viewMode, setViewMode] = useState<'edit' | 'read'>('edit')

  useEffect(() => {
    if (selectedFile && isEditing) {
      setLocalContent(fileContent)
      setHasUnsavedChanges(false)
      setSaveStatus("idle")
    }
  }, [selectedFile, fileContent, isEditing])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setLocalContent(newContent)
    setHasUnsavedChanges(newContent !== fileContent)
    // kick off debounced autosave
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
    autosaveTimerRef.current = setTimeout(() => {
      if (newContent !== fileContent) {
        handleSave(true)
      }
    }, 800)
  }

  const handleSave = async (isAutosave: boolean = false) => {
    if (!selectedFile || !hasUnsavedChanges) return

    setIsSaving(true)
    setSaveStatus("saving")
    try {
      await db.files.update(selectedFile.id, {
        note: localContent,
        updatedAt: Date.now()
      })
      setFileContent(localContent)
      setHasUnsavedChanges(false)
      setSaveStatus("saved")
    } catch (error) {
      console.error('Failed to save file:', error)
    } finally {
      setIsSaving(false)
      // Clear "Saved" indicator after a moment
      setTimeout(() => setSaveStatus("idle"), 1200)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div className="flex-1 p-6 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-500" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {selectedFile.fileName}
                </h2>
                {/* Notion-like save indicator */}
                <span className="ml-2 text-sm flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  {saveStatus === "saving" && (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
                    </>
                  )}
                  {saveStatus === "saved" && (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Saved
                    </>
                  )}
                  {saveStatus === "idle" && hasUnsavedChanges && (
                    <>Edited</>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm hidden sm:flex items-center gap-2 border rounded px-1.5 py-0.5">
                  <button
                    className={`flex items-center gap-1 px-1 py-0.5 rounded ${viewMode === 'edit' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}`}
                    onClick={() => setViewMode('edit')}
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    className={`flex items-center gap-1 px-1 py-0.5 rounded ${viewMode === 'read' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}`}
                    onClick={() => setViewMode('read')}
                  >
                    <Eye className="w-3.5 h-3.5" /> Read
                  </button>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges || isSaving}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
            {/* Editor mode switch */}
            <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>Editor:</span>
              <button
                className={`px-2 py-1 rounded border ${selectedFile?.editorType === 'simple' || !selectedFile?.editorType ? 'border-blue-500 text-blue-600' : 'border-transparent hover:border-gray-300'}`}
                onClick={async () => {
                  if (!selectedFile) return
                  await db.files.update(selectedFile.id, { editorType: 'simple' })
                }}
              >Simple</button>
              <button
                className={`px-2 py-1 rounded border ${selectedFile?.editorType === 'mdx' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:border-gray-300'}`}
                onClick={async () => {
                  if (!selectedFile) return
                  await db.files.update(selectedFile.id, { editorType: 'mdx' })
                }}
              ><Code2 className="inline w-3.5 h-3.5 mr-1" />MDX</button>
              <button
                className={`px-2 py-1 rounded border ${selectedFile?.editorType === 'sticky' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:border-gray-300'}`}
                onClick={async () => {
                  if (!selectedFile) return
                  await db.files.update(selectedFile.id, { editorType: 'sticky', stickyColor: selectedFile.stickyColor ?? 'yellow' })
                }}
              ><StickyNote className="inline w-3.5 h-3.5 mr-1" />Sticky</button>
            </div>

            {/* Render chosen editor or display based on view mode */}
            {viewMode === 'edit' ? (
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800">
                {(!selectedFile?.editorType || selectedFile?.editorType === 'simple') && (
                  <SimpleEditor
                    value={localContent}
                    onChange={(v) => handleContentChange({ target: { value: v } } as any)}
                    onKeyDown={handleKeyDown}
                    placeholder="Start writing your notes here..."
                  />
                )}
                {selectedFile?.editorType === 'sticky' && (
                  <StickyEditor
                    value={localContent}
                    onChange={(v) => handleContentChange({ target: { value: v } } as any)}
                    onKeyDown={handleKeyDown}
                    color={selectedFile?.stickyColor ?? 'yellow'}
                  />
                )}
                {selectedFile?.editorType === 'mdx' && (
                  <MdxEditor
                    value={localContent}
                    onChange={(v: string) => handleContentChange({ target: { value: v } } as any)}
                  />
                )}
              </div>
            ) : (
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-5 bg-white dark:bg-gray-800">
                {(!selectedFile?.editorType || selectedFile?.editorType === 'simple') && (
                  <DisplaySimple value={fileContent} />
                )}
                {selectedFile?.editorType === 'sticky' && (
                  <DisplaySticky value={fileContent} color={selectedFile?.stickyColor ?? 'yellow'} />
                )}
                {selectedFile?.editorType === 'mdx' && (
                  <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">{fileContent}</div>
                )}
              </div>
            )}
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Press Ctrl+S to save • Last updated: {new Date(selectedFile.updatedAt).toLocaleString()}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">No File Selected</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select a file from the sidebar to start editing, or create a new file.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
