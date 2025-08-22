// entityHandlers.ts
import { useCallback } from "react";
import { db } from "@/db/db"; // adjust path based on your project

export function useHandleCreateEntity(
  note: string,
  handleCreateEntityTypeChange: (
    createdBy: "button" | null,
    type: "file" | "folder",
    parentId?: string | null
  ) => void
) {
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
          note,
          createdAt: now,
          updatedAt: now,
          type: "file" as const,
        });
      }

      handleCreateEntityTypeChange(null, type);
    },
    [note, handleCreateEntityTypeChange]
  );

  return handleCreateEntity;
}
