import { db, FileSystemEntityBase } from "./db";

export const createFolder = async (data: FileSystemEntityBase) => {
  if (!data.name.trim()) return;

  await db.entities.add({
    id: crypto.randomUUID(),
    name: data.name.trim(),
    parentId: data.parentId,
    type: "folder",
    createdAt: new Date(),
    updatedAt: data.updatedAt || new Date(),
  });
};

export const createFile = async (data: FileSystemEntityBase) => {
  if (!data.name.trim()) return;

  await db.entities.add({
    id: crypto.randomUUID(),
    name: data.name.trim(),
    parentId: data.parentId,
    type: "file",
    content: data.content,
    createdAt: new Date(),
    updatedAt: data.updatedAt || new Date(),
  });
};
