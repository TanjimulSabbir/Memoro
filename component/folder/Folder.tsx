"use client";

import { useState } from "react";
import { FilePlus, FolderPlus, Settings } from "lucide-react";
import CreateFolder from "./CreateFolder";
import FolderList from "./ShowFolder";
import { getAllFolders } from "@/db/folder";

export default function FolderSidebar() {
  const [showCreateFolder, setShowCreateFolder] = useState(false);

  const refreshFolders = async() => {
    return await getAllFolders();
  };

  return (
    <aside className="border-r p-4 flex flex-col gap-4">
      {/* Icon Buttons */}
      <div className="flex justify-around space-x-5 mb-4">
        {/* Create File Icon */}
        <button
          title="Create File"
          className="p-2 hover:bg-gray-200 rounded"
          onClick={() => alert("Create File clicked")}
        >
          <FilePlus size={24} className="text-gray-600" />
        </button>

        {/* Create Folder Icon */}
        <button
          title="Create Folder"
          className="p-2 hover:bg-gray-200 rounded"
          onClick={() => setShowCreateFolder((prev) => !prev)}
        >
          <FolderPlus size={24} className="text-gray-600" />
        </button>

        {/* Settings Icon */}
        <button
          title="Settings"
          className="p-2 hover:bg-gray-200 rounded"
          onClick={() => alert("Settings clicked")}
        >
          <Settings size={24} className="text-gray-600" />
        </button>
      </div>

      {/* Show CreateFolder form if toggled */}
      {showCreateFolder && (
        <div className=" bg-white p-4 shadow-lg z-10 flex items-center justify-center">
          <CreateFolder
            onCreated={() => {
              refreshFolders();
              setShowCreateFolder(false);
            }}
          />
        </div>
      )}

      {/* Folder List here */}
      <FolderList refreshFolders={refreshFolders} />
    </aside>
  );
}
