"use client";
import { db, FileSystemEntityBase } from "@/db/db";
import { createFile, createFolder } from "@/db/entityCreate";
import { useEffect, useState } from "react";

export default function FolderTree({
  parentId = null,
}: {
  parentId?: string | null;
}) {
  const [entities, setEntities] = useState<FileSystemEntityBase[]>([]);


  const loadEntities = async () => {
    let children;

    if (parentId === null) {
      // When looking for root-level entities
      children = await db.entities
        .filter((entity) => entity.parentId === null)
        .toArray();
    } else {
      children = await db.entities.where("parentId").equals(parentId).toArray();
    }
    console.log(`Loading entities for parentId: ${parentId}`, children);

    setEntities(children);
  };

  useEffect(() => {
    loadEntities();
  }, [parentId]);

  return (
    <div className="ml-4 border-l pl-2">
      <ul>
        {entities.map((entity) => (
          <li key={entity.id}>
            {entity.type === "folder" ? (
              <>
                📁 {entity.name}
                <FolderTree parentId={entity.id} />
              </>
            ) : (
              <>📄 {entity.name}</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
