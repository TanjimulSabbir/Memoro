"use client";

import { useEffect, useState } from "react";
import { FilePlus, FolderPlus, Settings } from "lucide-react";
import CreateFolder from "./CreateFolder";
import FolderList from "./ShowFolder";
import { getAllFolders } from "@/db/folder";
import { Folder } from "@/db/dbTypes";

export default function FolderSidebar() {
  const [showCreate, setShowCreate] = useState({
    file: false,
    folder: false,
  });
  const [folders, setFolders] = useState<Folder[]>([]);

  const refreshFolders = async () => {
    const res = await getAllFolders();
    setFolders(res.reverse());
  };

  useEffect(() => {
    refreshFolders(); // Load folders on mount
  }, []);

  return (
    <aside className="border-r h-full p-4 gap-3 bg-white shadow-sm">
      {/* Header Icons */}
      <div className="flex justify-center items-center">
        <IconButton
          icon={<FilePlus size={20} />}
          label="New File"
          onClick={() => setShowCreate({ folder: false, file: true })}
        />
        <IconButton
          icon={<FolderPlus size={20} />}
          label="New Folder"
          onClick={() => setShowCreate({ folder: true, file: false })}
        />
        <IconButton
          icon={<Settings size={20} />}
          label="Settings"
          onClick={() => alert("Settings clicked!")}
        />
      </div>

      {/* Conditional Form */}
      {(showCreate.folder || showCreate.file) && (
        <div className="animate-fade-in mt-5">
          <CreateFolder
            onCreated={() => {
              refreshFolders();
              setShowCreate({ folder: false, file: false });
            }}
            type={showCreate.folder ? "folder" : "file"}
          />
        </div>
      )}

      {/* Folder List */}
      <div className="flex-1 overflow-y-auto mt-5">
        <FolderList folders={folders} />
      </div>
    </aside>
  );
}

// Reusable IconButton Component
function IconButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="p-2 hover:bg-gray-200 rounded-full transition-all text-gray-600"
    >
      {icon}
    </button>
  );
}
