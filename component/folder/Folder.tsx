// App.tsx
import React from "react";
import FolderTree from "./ShowFolder";

export default function App() {
  return (
    <div>
      <h1 className="text-xl font-bold">File Explorer</h1>
      <FolderTree />
    </div>
  );
}
