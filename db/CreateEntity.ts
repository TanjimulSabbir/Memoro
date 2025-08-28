import { entityCreationMethod } from "./../component/Sidebar/SideBar";
import { handleCreateEntityType } from "@/component/Folder/ShowFolder";
import { db } from "./db";
import { RightMenuClickType } from "@/component/Folder/ContextMenu";

type createAndUpdateEntityProps = {
  name: string;
  entity?: any;
  type: "FOLDER" | "FILE";
    rightClick?: RightMenuClickType;
  entityCreationMethod: entityCreationMethod;
  setContextMenu?: (menu: any) => void;
};

const handleCreateAndUpdateEntity = async (
  props: createAndUpdateEntityProps
) => {
  const { name, entity, type, rightClick, setContextMenu } = props;
  if (!name.trim() || name.length > 20) {
    return;
  }

  if (rightClick === "RENAME") {
    if (entity?.parentId === null) return;
    if (entity?.type === "FOLDER") {
      await db.folders.update(entity?.parentId, {
        folderName: name,
        updatedAt: Date.now(),
      });
    }
    if (entity?.type === "FILE") {
      await db.files.update(entity?.parentId, {
        fileName: name,
        updatedAt: Date.now(),
      });
    }
    setContextMenu &&
      setContextMenu({ entity: null, x: 0, y: 0, visible: false });
  }
if (entityCreationMethod === "BUTTON"||entityCreationMethod === null) {
  const now = Date.now();
  if (type === "FOLDER") {
    await db.folders.add({
      id: crypto.randomUUID(),
      parentId,
      folderName: name,
      createdAt: now,
      updatedAt: now,
      type: "FOLDER" as const,
    });
  } else {
    await db.files.add({
      id: crypto.randomUUID(),
      parentId,
      fileName: name,
      note: note,
      createdAt: now,
      updatedAt: now,
      type: "FILE" as const,
    });
  }
  setContextMenu({ entity: null, x: 0, y: 0, visible: false });
  return handleCreateEntityTypeChange({
    createBy: null,
    rightClickType: null,
    type,
    parentId: null,
  });
};
