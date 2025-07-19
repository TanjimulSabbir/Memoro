"use client";
import {
  createFolder,
  createNote,
  getFolders,
  getNotesByFolder,
} from "@/lib/db";
import React, { useEffect, useState } from "react";

export default function FolderNoteDemo() {
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const allFolders = await getFolders();
      setFolders(allFolders);
      if (allFolders.length > 0) {
        setActiveFolder(allFolders[0].id);
        const folderNotes = await getNotesByFolder(allFolders[0].id);
        setNotes(folderNotes);
      }
    }
    fetchData();
  }, []);

  async function handleAddFolder() {
    const name = prompt("Folder name");
    if (name) {
      await createFolder(name);
      const allFolders = await getFolders();
      setFolders(allFolders);
    }
  }

  async function handleAddNote() {
    const title = prompt("Note title");
    if (title && activeFolder) {
      await createNote(activeFolder, title, "");
      const folderNotes = await getNotesByFolder(activeFolder);
      setNotes(folderNotes);
    }
  }

  async function handleSelectFolder(id) {
    setActiveFolder(id);
    const folderNotes = await getNotesByFolder(id);
    setNotes(folderNotes);
  }

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div>
        <h2>Folders</h2>
        <button onClick={handleAddFolder}>Add Folder</button>
        <ul>
          {folders.map((f) => (
            <li
              key={f.id}
              onClick={() => handleSelectFolder(f.id)}
              style={{
                cursor: "pointer",
                fontWeight: f.id === activeFolder ? "bold" : "normal",
              }}
            >
              {f.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Notes</h2>
        <button onClick={handleAddNote} disabled={!activeFolder}>
          Add Note
        </button>
        <ul>
          {notes.map((n) => (
            <li key={n.id}>{n.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
