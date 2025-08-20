"use client";

import { Input } from "@/components/ui/input";
import { db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import {
  FileText,
  FolderIcon
} from "lucide-react";
import { useState } from "react";

export default function ShowFolder({ createEntityType, handleCreateEntityTypeChange }: { createEntityType: { createBy: "button" | null, type: "file" | "folder" }, handleCreateEntityTypeChange: (createdBy: "button" | null, type: "file" | "folder") => void }) {

  const [entityCreated, setEntityCreated] = useState(false);

  const entities = useLiveQuery(
    () => Promise.all([db.folders.toArray(), db.files.toArray()])
      .then(([folders, files]) => [...folders, ...files]),
    [entityCreated], // dependencies
    []  // default value
  );
  const [parentId, setParentId] = useState<number | null>(null);
  const [inputEntity, setInputEntity] = useState("");
  const [note, setNote] = useState("");

  const handleCreateEntity = async (name: string, parentId: number | null, type: "file" | "folder") => {
    if(name.trim() === "") {
      return handleCreateEntityTypeChange(null, "folder");
    }
    const data = {
      file: {
        parentId: parentId,
        fileName: name || "",
        note: note || "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        type: "file" as const,
      }, folder: {
        parentId: parentId,
        folderName: name || "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        type: "folder" as const,
      }
    }
    if (type === "folder") {
      await db.folders.add(data.folder)
      setEntityCreated(true);
      handleCreateEntityTypeChange(null, "folder" )
    } else if (type === "file") {
      await db.files.add(data.file)
      setEntityCreated(true);
      handleCreateEntityTypeChange(null, "file")
    }



  }
  console.log(entities, "<- entities");
  return (
    <>
      {createEntityType.createBy === "button" && (
        <Input
          defaultValue={inputEntity}
          onBlur={(e) =>
            handleCreateEntity(e.target.value, null, createEntityType.type)
          }
          onFocus={() => setInputEntity("")}
          placeholder={createEntityType.type === "folder" ? "New folder name" : "New file name"}
          onKeyDown={(e) => {
            // if (e.key === "Enter") {
            //   handleCreateEntity(e.target, null, createEntityType);
            // }
            if (e.key === "Escape") {
              setParentId(0);
            }
          }}
          autoFocus
          className="my-3 text-sm px-2 py-1 h-auto bg-transparent focus:ring-0 border-none"
        />)}
      <ul className="">
        {entities.map((entity) => (
          <div
            className={`flex items-center gap-2  ${entities.some((item) =>
              item.id === entity.parentId ? "ml-[12px]" : "ml-0"
            )} group pr-1 py-0.5 rounded hover:bg-muted/60 transition`}
            key={entity.id}
          >
            {/* Folder/File Icon */}
            {entity.type === "folder" ? (
              <p className="flex items-center space-x-1 text-xs">   <FolderIcon
                className="w-4 h-4 text-yellow-500"
                strokeWidth={1.5}
              />
                <span>{entity.folderName}</span>
              </p>
            ) : (
              <p><FileText className="w-4 h-4 text-sky-500" strokeWidth={1.5} />
                <span>{entity.fileName}</span>
              </p>
            )}
          </div>
        ))}
      </ul>

    </>
  );
}
