"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFile, createFolder } from "@/db/entityCreate";
import { useState } from "react";

type CreateEntityPropsType = {
  type: "folder" | "file";
  parentId: string | null;
};

export default function CreateEntity({
  type,
  parentId,
}: CreateEntityPropsType) {
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (type === "folder" && !folderName.trim()) return;
    if (type === "file" && !fileName.trim()) return;

    if (type === "folder")
      createFolder({
        id: crypto.randomUUID(),
        name: folderName.trim(),
        parentId,
        type: type,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    if (type === "file") {
      await createFile({
        id: crypto.randomUUID(),
        name: fileName.trim(),
        parentId: parentId, // Adjust as needed
        type: "file",
        content, // Default content for new life
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
  const handleName = (name: string) => {
    if (type === "folder") {
      setFolderName(name);
    }
    if (type === "file") {
      setFileName(name);
      setContent("This is a new life. You can edit it later."); // Default content for new files
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder={`${type === "folder" ? "Folder" : "File"} Name`}
        value={type === "folder" ? folderName : fileName}
        onChange={(e) => handleName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
        className="w-full"
      />
      <Button
        onClick={handleSubmit}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
        variant="default"
      >
        + {type === "folder" ? "Folder" : "File"}
      </Button>
    </div>
  );
}
