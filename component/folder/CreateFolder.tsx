"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addFolder } from "@/db/folder";
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
    if (!name.trim()) return;
    await addFolder({ name, parentId: null });
    setName("");
    if (onCreated) onCreated();
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder={`${type === "folder" ? "Folder" : "File"} Name`}
        value={name}
        onChange={(e) => setName(e.target.value)}
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
