import { EntityCreationStateProps } from "@/types/types";
import { db } from "./db";

export const handleCreateAndUpdateEntity = async (
  createEntityState: EntityCreationStateProps | null,
  setEntityCreationsState: (value: EntityCreationStateProps | null) => void,
  entityName: string
) => {
  const { entity, entityCreationType, rightMenuClick } =
    createEntityState || {};

  if (!entityName?.trim() || entityName?.length > 20) return;

  const now = Date.now();

  // 🔹 RENAME FLOW
  if (rightMenuClick === "RENAME") {
    if (!entity) return;

    if (entityCreationType === "FOLDER") {
      await db.folders.update(entity.id, {
        folderName: entityName,
        updatedAt: now,
      });
    } else if (entityCreationType === "FILE") {
      await db.files.update(entity.id, {
        fileName: entityName,
        updatedAt: now,
      });
    }

    setEntityCreationsState(null);
    return;
  }

  // 🔹 CREATE FLOW
  if (entityCreationType === "FOLDER") {
    await db.folders.add({
      id: crypto.randomUUID(),
      parentId: entity?.id ?? null,
      folderName: entityName,
      createdAt: now,
      updatedAt: now,
      type: "FOLDER",
    });
  } else if (entityCreationType === "FILE") {
    await db.files.add({
      id: crypto.randomUUID(),
      parentId: entity?.id ?? null,
      fileName: entityName,
      note: "this is a note",
      createdAt: now,
      updatedAt: now,
      type: "FILE",
    });
  }

  setEntityCreationsState(null); // ✅ Ensure state is reset after any create
};
