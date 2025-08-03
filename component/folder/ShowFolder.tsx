// components/FolderTree.tsx
"use client";

import { Input } from "@/components/ui/input";
import { db, FileSystemEntityBase } from "@/db/db";
import { createFolder, updateFolderName } from "@/db/entityCreate";
import { log } from "console";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  FolderIcon,
  MoreVertical,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function ShowFolder({
  load,
  setLoad,
  level = 0,
}: {
  load: string;
  setLoad: (value: string) => void;
  level?: number;
}) {
  const [entities, setEntities] = useState<FileSystemEntityBase[]>([]);
  const [parentId, setParentId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    entity: FileSystemEntityBase | null;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    entity: null,
    visible: false,
  });

  const handleUpdateFolder = async (
    foldername: string,
    entity: FileSystemEntityBase
  ) => {
    await updateFolderName(foldername, entity.id);
    setLoad("");
    fetchEntities();
  };

  const fetchEntities = async () => {
    const children = await db.entities
      .where("parentId")
      .equals(load ?? null)
      .toArray();

    setEntities(children);
  };

  useEffect(() => {
    fetchEntities();
  }, [parentId, load]);

  useEffect(() => {
    const handleClick = () =>
      setContextMenu((prev) => ({ ...prev, visible: false }));
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleContextClick = (
    e: React.MouseEvent,
    entity: FileSystemEntityBase
  ) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      entity,
      visible: true,
    });
  };

  const handleAction = async (action: string) => {
    const now = new Date();
    const id = crypto.randomUUID();
    const entity = contextMenu.entity;
    if (!entity) return;

    if (action === "edit") {
      setLoad(entity.id);
    } else if (action === "delete") {
      await db.entities.delete(entity.id);
      fetchEntities();
    } else if (action === "create-folder") {
      console.log(action);

      const res = await createFolder({
        id,
        name: "Untitled",
        parentId: entity.id,
        type: "folder",
        createdAt: now,
        updatedAt: now,
      });
      console.log(res, "create folder");

      setLoad(id);
      fetchEntities();
    } else if (action === "create-file") {
      await db.entities.add({
        id,
        name: "Untitled",
        parentId: entity.id,
        content: "",
        type: "folder",
        createdAt: now,
        updatedAt: now,
      });
      setLoad(id);
      fetchEntities();
    }

    setContextMenu({ ...contextMenu, visible: false });
  };

  return (
    <>
      <ul className="ml-2">
        {entities.map((entity) => (
          <div
            className={`flex items-center gap-2  ${entities.some((item) =>
              item.id === entity.parentId ? "ml-[12px]" : "ml-[8px]"
            )} group px-1 py-0.5 rounded hover:bg-muted/60 transition`}
            onContextMenu={(e) => handleContextClick(e, entity)}
            key={entity.id}
          >
            {/* Folder/File Icon */}
            {entity.type === "folder" ? (
              <FolderIcon
                className="w-4 h-4 text-yellow-500"
                strokeWidth={1.5}
              />
            ) : (
              <FileText className="w-4 h-4 text-sky-500" strokeWidth={1.5} />
            )}

            {/* Name or Input */}
            {entity.id === load ? (
              <Input
                defaultValue={entity.name}
                onBlur={(e) =>
                  handleUpdateFolder(e.currentTarget.value, entity)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateFolder(e.currentTarget.value, entity);
                  }
                  if (e.key === "Escape") {
                    setLoad("");
                  }
                }}
                autoFocus
                className="text-sm px-1 py-0.5 h-auto bg-transparent focus:ring-0 border-none"
              />
            ) : (
              <span
                onDoubleClick={() => setLoad(entity.id)}
                className="cursor-pointer text-sm text-foreground"
              >
                {entity.name}
              </span>
            )}

            {/* Optional: 3-dot action icon */}
            <MoreVertical
              className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setContextMenu({
                  x: e.pageX,
                  y: e.pageY,
                  entity,
                  visible: true,
                });
              }}
            />
          </div>
        ))}
      </ul>

      {contextMenu.visible && (
        <ul
          className="absolute z-50 bg-white border shadow-md rounded-md text-sm"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <li
            onClick={() => handleAction("create-file")}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            ➕ Create File
          </li>
          <li
            onClick={() => handleAction("create-folder")}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            📁 Create Folder
          </li>
          <li
            onClick={() => handleAction("edit")}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            ✏️ Rename
          </li>
          <li
            onClick={() => handleAction("delete")}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
          >
            ❌ Delete
          </li>
        </ul>
      )}
    </>
  );
}
