// components/Entity.tsx
"use client";
import { FileSystemEntityBase } from "@/db/db";
import FolderTree from "./ShowFolder";
import { ChevronLeft } from "lucide-react";

export default function Entity({
  entity,
  selectedFolderParentId,
  setSelectedFolderParentId,
}: {
  entity: FileSystemEntityBase;
  selectedFolderParentId: string | null;
  setSelectedFolderParentId: (folderId: string | null) => void;
  setType: (type: "folder" | "file") => void;
}) {
  return (
    <li key={entity.id} className="my-1">
      {entity.type === "folder" ? (
        <div>
          <p
            className={`flex items-center cursor-pointer p-1 rounded ${
              entity.id === selectedFolderParentId
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            onClick={() =>
              setSelectedFolderParentId(
                selectedFolderParentId === entity.id ? null : entity.id
              )
            }
          >
            <ChevronLeft /> {entity.name}
          </p>

          {selectedFolderParentId === entity.id && (
            <FolderTree
              parentId={entity.id}
              selectedFolderParentId={selectedFolderParentId}
              setSelectedFolderParentId={setSelectedFolderParentId}
            />
          )}
        </div>
      ) : (
        <div className="ml-5">📄 {entity.name}</div>
      )}
    </li>
  );
}
