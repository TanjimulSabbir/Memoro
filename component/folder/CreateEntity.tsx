"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFile, createFolder } from "@/db/entityCreate";
import { useState } from "react";

export default function CreateFolder({
  onCreated,
  type,
}: {
  onCreated?: () => void;
  type: "folder" | "file";
}) {
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (type === "folder")
      createFolder({
        id: crypto.randomUUID(),
        name: folderName,
        parentId,
        type: type,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    if (type === "file") {
      await createFile({
        id: crypto.randomUUID(),
        name: name.trim(),
        parentId: null, // Adjust as needed
        type: "file",
        content: "", // Default content for new files
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder={`${type === "folder" ? "Folder" : "File"} Name`}
        value={name}
        onChange={(e) => setName(e.target.value)}
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
