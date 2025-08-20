"use client";

import { Input } from "@/components/ui/input";
import { db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { FileText, FolderIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export default function ShowFolder({
  createEntityType,
  handleCreateEntityTypeChange,
}: {
  createEntityType: { createBy: "button" | null; type: "file" | "folder" };
  handleCreateEntityTypeChange: (
    createdBy: "button" | null,
    type: "file" | "folder"
  ) => void;
}) {
  // Live DB data
  const entities = useLiveQuery(
    async () => {
      const [folders, files] = await Promise.all([
        db.folders.toArray(),
        db.files.toArray(),
      ]);
      return [...folders, ...files];
    },
    [],
    []
  );

  // 🔑 useRef for typing buffer
  const inputRef = useRef("");
  const [note] = useState(""); // still state but not tied to keystrokes

  const handleCreateEntity = useCallback(
    async (name: string, parentId: number | null, type: "file" | "folder") => {
      if (!name.trim()) {
        return handleCreateEntityTypeChange(null, type);
      }

      const now = Date.now();

      if (type === "folder") {
        await db.folders.add({
          id: crypto.randomUUID(),
          parentId,
          folderName: name,
          createdAt: now,
          updatedAt: now,
          type: "folder" as const,
        });
      } else {
        await db.files.add({
          id: crypto.randomUUID(),
          parentId,
          fileName: name,
          note: note,
          createdAt: now,
          updatedAt: now,
          type: "file" as const,
        });
      }

      handleCreateEntityTypeChange(null, type);
    },
    [note, handleCreateEntityTypeChange]
  );

  if (!entities?.length && createEntityType.createBy !== "button") {
    return <p className="text-xs text-gray-500">No files or folders yet</p>;
  }

  console.log(entities,"<<<-Entities->>>");

  return (
    <>
      {createEntityType.createBy === "button" && (
        <Input
          defaultValue=""
          onChange={(e) => {
            inputRef.current = e.target.value; // ✅ store keystrokes in ref
          }}
          onBlur={() =>
            handleCreateEntity(inputRef.current, null, createEntityType.type)
          }
          placeholder={
            createEntityType.type === "folder"
              ? "New folder name"
              : "New file name"
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateEntity(inputRef.current, null, createEntityType.type);
            }
            if (e.key === "Escape") {
              handleCreateEntityTypeChange(null, createEntityType.type);
            }
          }}
          autoFocus
          className="my-3 text-sm px-2 py-1 h-auto bg-transparent focus:ring-0 border-none"
        />
      )}

      <ul>
        {entities.map((entity) => (
          <li
            className="flex items-center gap-2 group pr-1 py-0.5 rounded hover:bg-muted/60 transition"
            key={entity.id}
          >
            {entity.type === "folder" ? (
              <p className="flex items-center space-x-1 text-xs">
                <FolderIcon className="w-4 h-4 text-yellow-500" strokeWidth={1.5} />
                <span>{entity.folderName}</span>
              </p>
            ) : (
              <p className="flex items-center space-x-1 text-xs">
                <FileText className="w-4 h-4 text-sky-500" strokeWidth={1.5} />
                <span>{entity.fileName}</span>
              </p>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
