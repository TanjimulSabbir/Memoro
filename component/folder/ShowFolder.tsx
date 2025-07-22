import { Folder } from "@/db/dbTypes";
import { FolderIcon } from "lucide-react";
import React from "react";

export default function FolderList({ folders }: { folders: Folder[] }) {
  if (!folders || folders.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10 text-sm">
        <p className="text-gray-500">📂 No folders yet. Create one!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {folders.map((folder) => (
        <li
          key={folder.id}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer group border"
        >
          <FolderIcon className="text-blue-500 w-5 h-5 group-hover:scale-110 transition" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800 group-hover:underline">
              {folder.name}
            </span>
            <span className="text-xs text-gray-500">
              Created: {new Date(folder.createdAt).toLocaleDateString()}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
