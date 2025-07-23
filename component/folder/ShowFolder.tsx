"use client";
import { db } from "@/db/db";
import React, { useEffect, useState } from "react";

export default function FolderTree({
  parentId = null,
}: {
  parentId?: string | null;
}) {
  const [folders, setFolders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const load = async () => {
      const childFolders = await db.folders
        .where("parentId")
        .equals(parentId)
        .toArray();
      const childFiles = await db.files
        .where("parentId")
        .equals(parentId)
        .toArray();

      setFolders(childFolders);
      setFiles(childFiles);
    };

    load();
  }, [parentId]);

  const createFolder = async () => {
    if (folderName.trim()) {
      await db.folders.add({ name: folderName, parentId });
      setFolderName("");
      const updated = await db.folders
        .where("parentId")
        .equals(parentId)
        .toArray();
      setFolders(updated);
    }
  };

  const createFile = async () => {
    if (fileName.trim()) {
      await db.files.add({ name: fileName, parentId });
      setFileName("");
      const updated = await db.files
        .where("parentId")
        .equals(parentId)
        .toArray();
      setFiles(updated);
    }
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
        {folders.map((folder) => (
          <li key={folder.id}>
            📁 {folder.name}
            <FolderTree parentId={folder.id} />
          </li>
        ))}
        {files.map((file) => (
          <li key={file.id}>📄 {file.name}</li>
        ))}
      </ul>
    </div>
  );
}
