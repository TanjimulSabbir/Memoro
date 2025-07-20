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
          className="border px-2 py-0.5 rounded flex-grow"
        />
        <button type="submit" className="bg-blue-500 text-white rounded">
          Create
        </button>
      </form>
    </div>
  );
}
