"use client";

import { Input } from "@/components/ui/input";
import { db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import {
  FileText,
  FolderIcon
} from "lucide-react";
import { useState } from "react";

export default function ShowFolder() {
  const entities = useLiveQuery(
    () => Promise.all([db.folders.toArray(), db.files.toArray()])
      .then(([folders, files]) => [...folders, ...files]),
    [], // dependencies
    []  // default value
  );

  const [inputEntity, setInputEntity] = useState({
    file: {
      parentId: "",
      fileName: "",
      note: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      type: "file",
    }, folder: {
      parentId: "",
      folderName: "",
      children: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      type: "folder",
    }
  });
  const handleCreateEntity = async (data) => {
    if (data.type === "folder") {
      await db.folders.add(data)
    } else if (data.type === "file") {
      await db.files.add(data)
    }



  }
  console.log(entities, "<- entities");
  return (
    <>
      <ul className="ml-2">
        {entities.map((entity) => (
          <div
            className={`flex items-center gap-2  ${entities.some((item) =>
              item.id === entity.parentId ? "ml-[12px]" : "ml-[8px]"
            )} group px-1 py-0.5 rounded hover:bg-muted/60 transition`}
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


          </div>
        ))}
      </ul>


    </>
  );
}
