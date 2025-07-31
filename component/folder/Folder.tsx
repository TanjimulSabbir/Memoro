// App.tsx or any other parent component
"use client";
import React, { useEffect, useState } from "react";
import ShowFolder from "./ShowFolder";
import { Button } from "@/components/ui/button";
import CreateEntity from "./CreateEntity";
import { File, Folder } from "lucide-react";
import { createFolder } from "@/db/entityCreate";

export default function App() {
  const [selectedFolderParentId, setSelectedFolderParentId] = useState<
    string | null
  >(null);
  const [load, setLoad] = useState("");
  const [type, setType] = React.useState<"folder" | "file">(
    selectedFolderParentId ? "folder" : "file"
  );
  // useEffect(() => {
  //   setType(selectedFolderParentId ? "folder" : "file");
  // }, [selectedFolderParentId]);

  async function handleSubmit(CreateEntityType: string) {
    const now = new Date();
    const id = crypto.randomUUID();

    try {
      if (CreateEntityType === "folder") {
        const res = await createFolder({
          id,
          name: "Untitled",
          parentId: null,
          type: "folder",
          createdAt: now,
          updatedAt: now,
        });
        setLoad(id);
        console.log("Folder created:", res);
      }
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">MEMORO</h1>
      <div className="mt-5 mb-10">
        <div className="flex gap-2 mb-4">
          <Button onClick={() => handleSubmit("folder")}>
            <Folder />
          </Button>
          <Button onClick={() => handleSubmit("file")}>
            <File />
          </Button>
        </div>
      </div>
      <ShowFolder load={load} setLoad={setLoad} />
    </div>
  );
}
