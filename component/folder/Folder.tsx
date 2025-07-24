"use client";
import React from "react";
import FolderTree from "./ShowFolder";
import CreateEntity from "./CreateEntity";
import { Button } from "@/components/ui/button";

export default function App() {
  const [type, setType] = React.useState<"folder" | "file">("folder");
  return (
    <div className="border-r p-5">
      <h1 className="text-xl font-bold">Memoro</h1>
      <div className="mt-5 mb-10">
        <div className="flex gap-2 mb-4">
          <Button onClick={() => setType("folder")}>FOLDER</Button>
          <Button onClick={() => setType("file")}>FILE</Button>
        </div>
        <CreateEntity type={type} parentId={null} />
      </div>

      <FolderTree />
    </div>
  );
}
