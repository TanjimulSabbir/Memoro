// components/FolderTree.tsx
"use client";
import { useEffect, useState } from "react";
import { db, FileSystemEntityBase } from "@/db/db";
import Entity from "./Entity";

export default function FolderTree({
  parentId,
  selectedFolderParentId,
  setSelectedFolderParentId,
}: {
  parentId: string | null;
  selectedFolderParentId: string | null;
  setSelectedFolderParentId: (folderId: string | null) => void;
}) {
  const [entities, setEntities] = useState<FileSystemEntityBase[]>([]);

  useEffect(() => {
    const loadEntities = async () => {
      let children;

      if (parentId === null) {
        children = await db.entities
          .filter((entity) => entity.parentId === null)
          .toArray();
      } else {
        children = await db.entities
          .where("parentId")
          .equals(parentId)
          .toArray();
      }

      setEntities(children);
    };

    loadEntities();
  }, [parentId]);

  return (
    <ul className="ml-4 border-l pl-2">
      {entities.map((entity) => (
        <Entity
          key={entity.id}
          entity={entity}
          selectedFolderParentId={selectedFolderParentId}
          setSelectedFolderParentId={setSelectedFolderParentId}
        />
      ))}
    </ul>
  );
}
