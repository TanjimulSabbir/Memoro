import { db } from "./db";
import { EntityCreationStateProps } from "@/types/types";

export const handleCreateAndUpdateEntity = async (
  createEntityState: EntityCreationStateProps | null,
  setEntityCreationsState: (value: EntityCreationStateProps | null) => void,
  entityName: string
) => {
  const {
    entityCreationMethod,
    entity,
    entityCreationType,
    rightMenuClick,
    contextMenu,
    setContextMenu,
  } = createEntityState || {};

  console.log(createEntityState, entityName, "entity log");

  if (!entityName?.trim() || entityName?.length > 20) return;

  // 🔹 RENAME FLOW
  if (rightMenuClick === "RENAME") {
    if (!entity || entity.parentId === null) return;

    if (entityCreationType === "FOLDER") {
      await db.folders.update(entity.id, {
        folderName: entityName,
        updatedAt: Date.now(),
      });
    }
    if (entityCreationType === "FILE") {
      await db.files.update(entity.id, {
        fileName: entityName,
        updatedAt: Date.now(),
      });
    }

    return setEntityCreationsState(null);
  }

  // 🔹 CREATE FLOW

  const now = Date.now();

  if (entityCreationType === "FOLDER") {
    await db.folders.add({
      id: crypto.randomUUID(),
      parentId: entity?.parentId ?? null,
      folderName: entityName,
      createdAt: now,
      updatedAt: now,
      type: "FOLDER" as const,
    });
  } else if (entityCreationType === "FILE") {
    await db.files.add({
      id: crypto.randomUUID(),
      parentId: entity?.parentId ?? null,
      fileName: entityName,
      note: "this is a note",
      createdAt: now,
      updatedAt: now,
      type: "FILE" as const,
    });

    // reset
    return setEntityCreationsState(null);
  }
};
