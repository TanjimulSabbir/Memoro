"use client";

import { Input } from "@/components/ui/input";
import { db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { FileText, FolderIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import DynamicInput from "./EntityCreatingInput";
import EntityFolder from "./Folder";

export default function ShowFolder({
  createEntityType,
  handleCreateEntityTypeChange,
}: {
  createEntityType: { createBy: "button" | null; type: "file" | "folder", parentId?: string | null };
  handleCreateEntityTypeChange: (
    createdBy: "button" | null,
    type: "file" | "folder",
    parentId?: string | null
  ) => void;
}) {
  // Live DB data
  const entities = useLiveQuery(
    async () => {
      const [folders, files] = await Promise.all([
        db.folders.toArray(),
        db.files.toArray(),
      ]);

      // merge and sort newest first
      return [...folders, ...files].sort(
        (a, b) => b.createdAt - a.createdAt
      );
    },
    [],
    []
  );

  const [note] = useState(""); // still state but not tied to keystrokes

  const handleCreateEntity = useCallback(
    async (name: string, parentId: string | null, type: "file" | "folder") => {
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

  console.log(entities, "<<<-Entities->>>");

  return (
    <>
      {createEntityType.createBy === "button" && (
        <DynamicInput
          entityType="folder"
          onSubmit={(val, type) => handleCreateEntity(val, null, type)}
          onCancel={(type) => handleCreateEntityTypeChange(null, type)}
        />

      )}

      <ul>
        {entities.map((entity) => (
          <li
            className="flex items-center gap-2 group pr-1 py-0.5 rounded hover:bg-muted/60 transition"
            key={entity.id}
          >
            {entity.type === "folder" ? (
              <div className="w-full">
                <EntityFolder entity={entity} handleCreateEntityTypeChange={handleCreateEntityTypeChange} />
                {createEntityType.type === "folder" && entity.id === createEntityType.parentId && (
                  <DynamicInput
                    entityType="folder"
                    onSubmit={(val, type) => handleCreateEntity(val, entity.id, type)}
                    onCancel={(type) => handleCreateEntityTypeChange(null, type)}
                  />
                )}</div>
            ) : (
              <div className="w-full">
                <p className="flex items-center space-x-1 text-xs" onClick={() => handleCreateEntityTypeChange(null, "file", entity.parentId || entity.id)}>
                  <FileText className="w-4 h-4 text-sky-500" strokeWidth={1.5} />
                  <span>{entity.fileName}</span>
                </p>
                {createEntityType.type === "file" && entity.id === createEntityType.parentId && (
                  <DynamicInput
                    entityType="file"
                    onSubmit={(val, type) => handleCreateEntity(val, entity.id, type)}
                    onCancel={(type) => handleCreateEntityTypeChange(null, type)}
                  />
                )}</div>

            )}
          </li>
        ))}
      </ul>
    </>
  );
}
