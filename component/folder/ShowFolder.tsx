"use client";

import { Folder } from "@/db/dbTypes";
import { getAllFolders } from "@/db/folder";
import React, { useEffect, useState } from "react";

export default function FolderList({
  refreshFolders,
}: {
  refreshFolders?: () => Promise<Folder[]>;
}) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFolders() {
      let fetchedFolders: Folder[] = [];
      if (refreshFolders) {
        fetchedFolders = await refreshFolders();
      } else {
        fetchedFolders = await getAllFolders();
      }
      setFolders(fetchedFolders);
      setLoading(false);
    }

    fetchFolders();
  }, []);

  if (loading) return <p>Loading folders...</p>;

  if (folders.length === 0) return <p>No folders found.</p>;

  return (
    <ul>
      {folders.map((folder) => (
        <li key={folder.id} className="p-2 border-b">
          {folder.name}
        </li>
      ))}
    </ul>
  );
}
