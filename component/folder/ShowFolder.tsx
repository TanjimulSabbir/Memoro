"use client";
import { db, FileSystemEntityBase } from "@/db/db";
import { createFile, createFolder } from "@/db/entityCreate";
import { useEffect, useState } from "react";

export default function FolderTree({
  parentId = null,
}: {
  parentId?: string | null;
}) {
  const [entities, setEntities] = useState<FileSystemEntityBase[]>([]);
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");

  const loadEntities = async () => {
    let children;

    if (parentId === null) {
      // When looking for root-level entities
      children = await db.entities
        .filter((entity) => entity.parentId === null)
        .toArray();
    } else {
      children = await db.entities.where("parentId").equals(parentId).toArray();
    }
    console.log(`Loading entities for parentId: ${parentId}`, children);

    setEntities(children);
  };

  useEffect(() => {
    loadEntities();
  }, [parentId]);

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
          onClick={() =>
            createFolder({
              id: crypto.randomUUID(),
              name: folderName,
              parentId,
              type: "folder",
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          }
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
          onClick={() =>
            createFile({
              id: crypto.randomUUID(),
              name: fileName,
              parentId,
              type: "file",
              content,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          }
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
