"use client";
import { addFolder } from "@/db/folder";
import { useState } from "react";

export default function CreateFolder({
  onCreated,
}: {
  onCreated?: () => void;
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
          placeholder="New folder name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded flex-grow"
        />
        <button type="submit" onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)} className="bg-blue-500 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}
