import { db } from "./db";
import {
  EntityCreationMethod,
  EntityCreationStateProps,
  RightMenuClick,
} from "@/types/types";

interface props {
  createEntityState: EntityCreationStateProps | null;
  setEntityCreationsState: (value: EntityCreationStateProps) => void;
}

export const handleCreateAndUpdateEntity = async (createEntityState: EntityCreationStateProps | null, setEntityCreationsState: (value: EntityCreationStateProps) => void) => {
  const {
    entityName,
    entityCreationMethod,
    entity,
    entityCreationType,
    rightMenuClick,
    setContextMenu,
  } = createEntityState || {};

  if (!entityName?.trim() || entityName?.length > 20) {
    return;
  }

  if (rightMenuClick === "RENAME") {
    if (entity?.parentId === null) return;
    if (entity?.type === "FOLDER") {
      await db.folders.update(entity?.parentId, {
        folderName: entityName,
        updatedAt: Date.now(),
      });
    }
    if (entity?.type === "FILE") {
      await db.files.update(entity?.parentId, {
        fileName: entityName,
        updatedAt: Date.now(),
      });
    }
    setContextMenu &&
      setContextMenu({ entity: null, x: 0, y: 0, visible: false });
  }
  if (entityCreationMethod === "BUTTON" || entityCreationMethod === null) {
    const now = Date.now();
    if (entityCreationType === "FOLDER") {
      await db.folders.add({
        id: crypto.randomUUID(),
        parentId: null,
        folderName: entityName,
        createdAt: now,
        updatedAt: now,
        type: "FOLDER" as const,
      });
    } else {
      await db.files.add({
        id: crypto.randomUUID(),
        parentId: null,
        fileName: entityName,
        note: "this is a note",
        createdAt: now,
        updatedAt: now,
        type: "FILE" as const,
      });
    }
    setContextMenu &&
      setContextMenu({ entity: null, x: 0, y: 0, visible: false });
    return setEntityCreationsState(null);
  }
};
