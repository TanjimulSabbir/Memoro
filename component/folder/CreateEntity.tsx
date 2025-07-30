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

    const now = new Date();
    const id = crypto.randomUUID();

    if (type === "folder" && !folderName.trim()) return;
    if (type === "file" && !fileName.trim()) return;

    try {
      if (type === "folder") {
        const res = await createFolder({
          id,
          name: folderName.trim(),
          parentId,
          type: "folder",
          createdAt: now,
          updatedAt: now,
        });
        console.log("Folder created:", res);
      }

      if (type === "file") {
        const res = await createFile({
          id,
          name: fileName.trim(),
          parentId,
          type: "file",
          content,
          createdAt: now,
          updatedAt: now,
        });
        console.log("File created:", res);
      }

      // Optional reset logic
      setFolderName("");
      setFileName("");
      setContent("This is a new life. You can edit it later.");
    } catch (error) {
      console.error("Failed to create entity:", error);
    }
  }

  const handleName = (name: string) => {
    if (type === "folder") {
      setFolderName(name);
    }
    if (type === "file") {
      setFileName(name);
      setContent("This is a new life. You can edit it later.");
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
        className="cursor-pointer"
      >
        + {type === "folder" ? "Folder" : "File"}
      </Button>
    </div>
  );
}
