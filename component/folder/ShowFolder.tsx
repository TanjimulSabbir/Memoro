// components/FolderTree.tsx
"use client";
import { Input } from "@/components/ui/input";
import { db, FileSystemEntityBase } from "@/db/db";
import { createFolder, UpdateFolderName } from "@/db/entityCreate";
import { log } from "console";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function ShowFolder({
  parentId,
  load,
  setLoad,
}: {
  parentId: string | null;
  load: string;
  setLoad: (value: string) => void;
}) {
  const [entities, setEntities] = useState<FileSystemEntityBase[]>([]);
  const [addName, setAddName] = useState("");

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
      const findLatestEntity = children.find((item) => item.id === load);
      console.log(children, findLatestEntity, "children,findLatestEntity");

      setEntities(children);
    };

    loadEntities();
  }, [parentId, load]);

  const handleUpdateFolder = async (
    foldername: string,
    entity: FileSystemEntityBase
  ) => {
    const res = await UpdateFolderName(foldername, entity);
    setLoad("");
    console.log(res, "updated foldername");
  };

  return (
    <ul className="ml-4 border-l pl-2">
      {entities.map((entity) => (
        <li key={entity.id} className="my-1">
          {entity.type === "folder" ? (
            <div>
              <p className="flex items-center space-x-1">
                <ChevronLeft />{" "}
                {entity.id === load ? (
                  <Input
                    defaultValue={entity.name}
                    onBlur={(e) => handleUpdateFolder(e.target.value, entity)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUpdateFolder(e.currentTarget.value, entity);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  entity.name
                )}
              </p>
              {/* <Entity entity={entity} load={load} /> */}
            </div>
          ) : (
            <div className="ml-5">📄 {entity.name}</div>
          )}
        </li>
      ))}
    </ul>
  );
}
