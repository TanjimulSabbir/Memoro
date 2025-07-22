import { Folder } from "@/db/dbTypes";
import { FolderIcon, MoreVertical } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // assuming shadcn/ui
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FolderListProps {
  folders: Folder[];
  onCreateFile: (folderId: number, fileName: string) => void;
}

export default function FolderList({ folders, onCreateFile }: FolderListProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  if (!folders || folders.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10 text-sm">
        <p className="text-gray-500">📂 No folders yet. Create one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-5">
      <ul className="space-y-2">
        {folders.map((folder) => {
          const isSelected = selectedFolderId === folder.id;
          return (
            <li
              key={folder.id}
              onClick={() => setSelectedFolderId(folder.id)}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                isSelected ? "bg-blue-100 border-blue-300" : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderIcon className="text-blue-500 w-5 h-5" />
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-semibold ${
                      isSelected ? "text-blue-700" : "text-gray-800"
                    }`}
                  >
                    {folder.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(folder.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* 3-dot menu */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-40 p-2 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => setSelectedFolderId(folder.id)}
                  >
                    📄 Create File
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm"
                  >
                    📝 Rename Folder
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm text-red-500"
                  >
                    🗑️ Delete Folder
                  </Button>
                </PopoverContent>
              </Popover>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
