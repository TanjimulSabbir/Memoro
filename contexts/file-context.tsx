"use client"

import React, { createContext, useContext, useState } from 'react'

interface FileContextType {
  selectedFile: any | null
  setSelectedFile: (file: any | null) => void
  fileContent: string
  setFileContent: (content: string) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
}

const FileContext = createContext<FileContextType | undefined>(undefined)

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [selectedFile, setSelectedFile] = useState<any | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  return (
    <FileContext.Provider value={{
      selectedFile,
      setSelectedFile,
      fileContent,
      setFileContent,
      isEditing,
      setIsEditing
    }}>
      {children}
    </FileContext.Provider>
  )
}

export function useFile() {
  const context = useContext(FileContext)
  if (context === undefined) {
    throw new Error('useFile must be used within a FileProvider')
  }
  return context
}
