"use client";
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
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        📁
        <input
          type="text"
          placeholder={`New ${type} name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border h-9 rounded pl-2 flex-grow placeholder:text-sm"
        />
        <button
          type="submit"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
          className="bg-blue-500 text-white px-4 py-2 text-sm rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
}
