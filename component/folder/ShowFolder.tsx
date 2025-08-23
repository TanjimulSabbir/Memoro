"use client";

import { db, File, Folder } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useState } from "react";
import DynamicInput from "./EntityCreatingInput";
import EntityRenderer from "./RenderEntity";
import ContextMenu from "./ContextMenu";

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
  const entities = useLiveQuery(
    async () => {
      const [folders, files] = await Promise.all([
        db.folders.toArray(),
        db.files.toArray(),
      ]);

      const allEntities = [...folders, ...files];

      // Map entities by ID for quick lookup
      const map = new Map<string, any>();
      allEntities.forEach(entity => {
        map.set(entity.id, { ...entity, children: [] });
      });

      const roots: any[] = [];

      allEntities.forEach(entity => {
        if (entity.parentId) {
          const parent = map.get(entity.parentId);
          if (parent) {
            parent.children.push(map.get(entity.id));
          }
        } else {
          roots.push(map.get(entity.id));
        }
      });

      // Recursive sort by createdAt
      const sortChildren = (nodes: any[]) => {
        nodes.sort((a, b) => b.createdAt - a.createdAt);
        nodes.forEach(node => {
          if (node.children.length > 0) sortChildren(node.children);

        });
      };

      sortChildren(roots);

      return roots;
    },
    [],
    []
  );




  const [note] = useState(""); // still state but not tied to keystrokes
  const [contextMenu, setContextMenu] = useState<{ entity: Folder | File|null; x: number; y: number; visible: boolean }>({ entity: null, x: 0, y: 0, visible: false });

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

  // const [contextMenu, setContextMenu] = useState<{
  //   entityId: string | null;
  //   x: number;
  //   y: number;
  //   visible: boolean;
  // }>({ entityId: null, x: 0, y: 0, visible: false });

  const handleOnMenuContext = (e: React.MouseEvent<HTMLLIElement>, entity: Folder | File) => {
    e.preventDefault();
    setContextMenu({ entity, x: e.clientX, y: e.clientY, visible: true });
  };

  const handleCreateEntityByRightClick = (type: "folder" | "file") => {
    if (!contextMenu.entity) return;
    handleCreateEntityTypeChange(null, type, contextMenu.entity.id);
    setContextMenu({ ...contextMenu, entity: null, visible: false });
  };



  console.log(entities, "<<<-Entities->>>");

  return (
    <>
      {createEntityType.createBy === "button" && (
        <div className="mb-5">
          <DynamicInput
            entityType="folder"
            onSubmit={(val, type) => handleCreateEntity(val, null, type)}
            onCancel={(type) => handleCreateEntityTypeChange(null, type)}
          />

       </div>
      )}

      <ul>
        {entities?.length > 0 ? (
          entities.map((entity: any) => (
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
