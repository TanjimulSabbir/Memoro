"use client";
import { db, FileSystemEntityBase } from "@/db/db";
import { createFile, createFolder } from "@/db/entityCreate";
import { ArrowRight, ChevronLeft } from "lucide-react";
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
    <div className="border-l ml-2 pl-4 text-black">
      <ul>
        {entities.map((entity) => (
          <li key={entity.id}>
            {entity.type === "folder" ? (
              <>
                <p className="flex items-center cursor-pointer">
                  {" "}
                  <ChevronLeft className="w-5 h-5 font-thin"/> {entity.name}
                </p>
                <FolderTree parentId={entity.id} />
              </>
            ) : (
              <li>📄 {entity.name}</li>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
