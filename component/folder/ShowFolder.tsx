"use client";

import { db, File, Folder } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect, useState } from "react";
import DynamicInput from "./EntityCreatingInput";
import EntityRenderer from "./RenderEntity";
import ContextMenu from "./ContextMenu";

export default function ShowFolder({
  createEntityType,
  handleCreateEntityTypeChange,
  searchResults
}: {
  createEntityType: { createBy: "button" | null; type: "file" | "folder", parentId?: string | null };
  handleCreateEntityTypeChange: (
    createdBy: "button" | null,
    type: "file" | "folder",
    parentId?: string | null
    ) => void;
    searchResults?: (Folder | File)[];
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

  console.log(entities,searchResults, "<<<-Entities, SearchResults->>>");
const [showData,setShowData]=useState<any[]>([])
  useEffect(() => {
   setShowData(searchResults?.length ? searchResults : entities);
  }, [searchResults?.length, entities])

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
        {showData?.length > 0 ? (
          showData.map((entity: any) => (
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
