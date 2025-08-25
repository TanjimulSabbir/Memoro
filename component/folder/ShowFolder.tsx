"use client";

import { db, File, Folder } from "@/db/db";
import { useCallback, useEffect, useState } from "react";
import ContextMenu from "./ContextMenu";
import DynamicInput from "./EntityCreatingInput";
import EntityRenderer from "./RenderEntity";

export default function ShowFolder({
  createEntityType,
  handleCreateEntityTypeChange,
  data
}: {
  createEntityType: { createBy: "button" | null; type: "file" | "folder", parentId?: string | null };
  handleCreateEntityTypeChange: (
    createdBy: "button" | null,
    type: "file" | "folder",
    parentId?: string | null
  ) => void;
  data?: (Folder | File)[];
}) {
  const [note] = useState(""); // still state but not tied to keystrokes
  const [contextMenu, setContextMenu] = useState<{ entity: Folder | File | null; x: number; y: number; visible: boolean }>({ entity: null, x: 0, y: 0, visible: false });

  const handleCreateEntity = useCallback(
    async (name: string, parentId: string | null, type: "file" | "folder") => {
      if (!name.trim() || name.length > 20) {
        return;
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

  const handleOnMenuContext = (e: React.MouseEvent<HTMLDivElement>, entity: Folder | File) => {
    e.preventDefault();
    setContextMenu({ entity, x: e.clientX, y: e.clientY, visible: true });
  };

  const handleCreateEntityByRightClick = (type: "folder" | "file") => {
    if (!contextMenu.entity) return;
    handleCreateEntityTypeChange(null, type, contextMenu.entity.id);
    setContextMenu({ ...contextMenu, entity: null, visible: false });
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
      {createEntityType.createBy === "button" && (
        <div className="mb-5">
          <DynamicInput
            entityType="folder"
            placeholder={createEntityType.type === "folder" ? "Create New Folder" : "Create New File"}
            onSubmit={(val) => handleCreateEntity(val, null, createEntityType.type)}
            onCancel={(type) => handleCreateEntityTypeChange(null, type)}
          />
        </div>
      )}
      {/* This is the list of entities */}
      <ul>
        {data && data?.length > 0 ? (
          data.map((entity: any) => (
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
          handleCreateEntityByRightClick={handleCreateEntityByRightClick}
        />
      )}
    </>
  );
}
