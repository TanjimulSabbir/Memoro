"use client";
import { db, FileSystemEntityBase } from "@/db/db";
import { IndexableType } from "dexie";
import React, { useEffect, useState } from "react";

export default function FolderTree({
  parentId = null,
}: {
  parentId?: string | null;
}) {
  const [entities, setEntities] = useState<FileSystemEntityBase[]>([]);
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");

  const loadEntities = async () => {
    const children = await db.entities
      .where("parentId")
      .equals(parentId as IndexableType) // ✅ prevents runtime error for null
      .toArray();
    setEntities(children);
  };

  useEffect(() => {
    loadEntities();
  }, [parentId]);

  const createFolder = async () => {
    if (!folderName.trim()) return;

    await db.entities.add({
      id: crypto.randomUUID(),
      name: folderName.trim(),
      parentId,
      type: "folder",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    setFolderName("");
    loadEntities();
  };

  const createFile = async () => {
    if (!fileName.trim()) return;

    await db.entities.add({
      id: crypto.randomUUID(),
      name: fileName.trim(),
      parentId,
      type: "file",
      content: "", // start with empty content
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    setFileName("");
    loadEntities();
  };

  return (
    <div className="ml-4 border-l pl-2">
      <div className="mb-2">
        <input
          className="border rounded p-1 text-sm mr-2"
          placeholder="New Folder Name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-2 py-1 text-sm rounded"
          onClick={createFolder}
        >
          ➕📁
        </button>
      </div>

      <div className="mb-4">
        <input
          className="border rounded p-1 text-sm mr-2"
          placeholder="New File Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-2 py-1 text-sm rounded"
          onClick={createFile}
        >
          ➕📄
        </button>
      </div>

      <ul>
        {entities.map((entity) => (
          <li key={entity.id}>
            {entity.type === "folder" ? (
              <>
                📁 {entity.name}
                <FolderTree parentId={entity.id} />
              </>
            ) : (
              <>📄 {entity.name}</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
