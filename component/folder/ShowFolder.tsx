"use client";

import { db, File, Folder } from "@/db/db";
import { log } from "console";
import { useCallback, useEffect, useState } from "react";
import { createdBy, CreateEntityType } from "../Sidebar/SideBar";
import ContextMenu, { RightMenuClickType } from "./ContextMenu";
import DynamicInput from "./EntityCreatingInput";
import EntityRenderer from "./RenderEntity";

// export type ChildEntity = (Folder | File) & { children: ChildEntity[] };
export type ContextMenuType = {
  entity: any
  x: number;
  y: number;
  visible: boolean
}
export type handleCreateEntityType = {
  name: string;
  parentId: string | null;
  type: "FOLDER" | "FILE";
  createdBy: createdBy
  rightClickType: RightMenuClickType | null
}
export default function ShowFolder({
  createEntityType,
  handleCreateEntityTypeChange,
  data
}: {
  createEntityType: CreateEntityType;
  handleCreateEntityTypeChange: (createEntityType: CreateEntityType) => void;
  data?: (Folder | File)[];
}) {
  const [note] = useState(""); // still state but not tied to keystrokes
  const [contextMenu, setContextMenu] = useState<ContextMenuType>({ entity: null, x: 0, y: 0, visible: false });

  const handleCreateEntity = useCallback(
    async (handleCreateEntityType: handleCreateEntityType) => {
      const { name, parentId, type, } = handleCreateEntityType;
      console.log({ handleCreateEntityType, createEntityType, contextMenu: contextMenu.entity });

      if (!name.trim() || name.length > 20) {
        return;
      }
      console.log({ createEntityType, handleCreate: { name, parentId, type, } });

      if (createEntityType.rightClickType === "RENAME" && createEntityType.parentId) {

        if (createEntityType.parentId === null) return;
        if (createEntityType.type === "FOLDER") {
          await db.folders.update(createEntityType.parentId, { folderName: name });
        }
        if (createEntityType.type === "FILE") {
          await db.files.update(createEntityType.parentId, { fileName: name });
        }
        return handleCreateEntityTypeChange({ createBy: null, rightClickType: null, type, parentId: null });
      }

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

      handleCreateEntityTypeChange({ createBy: null, rightClickType: null, type, parentId: null });
    },
    [note, handleCreateEntityTypeChange]
  );

  const handleOnMenuContext = (e: React.MouseEvent<HTMLDivElement>, entity: Folder | File,) => {
    e.preventDefault();
    setContextMenu({ entity, x: e.clientX, y: e.clientY, visible: true });
  };



  // Close menu on global click
  useEffect(() => {
    const handleClickOutside = () => setContextMenu((c) => ({ ...c, visible: false }));
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);


  return (
    <>
      {/* this is the create entity input while no parentId(first layer entity) */}
      {createEntityType.createBy === "BUTTON" && (
        <div className="mb-5">
          <DynamicInput
            entityType={createEntityType.type}
            placeholder={createEntityType.type === "FOLDER" ? "Create New Folder" : "Create New File"}
            onSubmit={(val) => handleCreateEntity({ name: val, parentId: null, type: createEntityType.type, createdBy: createEntityType.createBy, rightClickType: null })}
            onCancel={(type) => handleCreateEntityTypeChange({ createBy: null, type, parentId: null, rightClickType: null })}
          />
        </div>
      )}
      {/* This is the list of entities */}
      <ul>
        {data && data?.length > 0 ? (
          data.map((entity: (Folder | File)) => (
            <EntityRenderer
              key={entity.id}
              entity={entity}
              createEntityType={createEntityType}
              handleCreateEntityTypeChange={handleCreateEntityTypeChange}
              handleCreateEntity={handleCreateEntity}
              handleOnMenuContext={handleOnMenuContext}
            />
          ))
        ) : (
          <p className="text-xs text-gray-500">No files or folders yet</p>
        )}
      </ul>
      {/* This is right click menu */}
      {contextMenu.visible && (
        <ContextMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          handleCreateEntityTypeChange={handleCreateEntityTypeChange}
        />
      )}
    </>
  );
}
