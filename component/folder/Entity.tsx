// components/Entity.tsx
"use client";
import { FileSystemEntityBase } from "@/db/db";
import { ChevronLeft } from "lucide-react";

export default function Entity({
  entity,
  load,
}: {
  entity: FileSystemEntityBase;
  load: string;
}) {
  return (
    <li key={entity.id} className="my-1">
      {entity.type === "folder" ? (
        <div>
          <p>
            <ChevronLeft /> {entity.name}
          </p>
          <Entity entity={entity} load={load} />
        </div>
      ) : (
        <div className="ml-5">📄 {entity.name}</div>
      )}
    </li>
  );
}
