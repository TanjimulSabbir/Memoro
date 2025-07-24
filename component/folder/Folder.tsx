// App.tsx or any other parent component
"use client";
import React, { useEffect, useState } from "react";
import ShowFolder from "./ShowFolder";
import { Button } from "@/components/ui/button";
import CreateEntity from "./CreateEntity";

export default function App() {
  const [selectedFolderParentId, setSelectedFolderParentId] = useState<
    string | null
  >(null);
  const [type, setType] = React.useState<"folder" | "file">(
    selectedFolderParentId ? "folder" : "file"
  );
  // useEffect(() => {
  //   setType(selectedFolderParentId ? "folder" : "file");
  // }, [selectedFolderParentId]);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">File Explorer</h1>
      <div className="mt-5 mb-10">
        <div className="flex gap-2 mb-4">
          <Button
            className={`${type === "folder" ? "!bg-green-500" : ""}`}
            onClick={() => setType("folder")}
          >
            FOLDER
          </Button>
          <Button
            className={`${type === "file" ? "!bg-green-500" : ""}`}
            onClick={() => setType("file")}
          >
            FILE
          </Button>
        </div>
        <CreateEntity type={type} parentId={selectedFolderParentId || null} />
      </div>
      <ShowFolder
        parentId={null}
        selectedFolderParentId={selectedFolderParentId}
        setSelectedFolderParentId={setSelectedFolderParentId}
      />
    </div>
  );
}
