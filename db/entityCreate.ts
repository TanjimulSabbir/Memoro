import { db, FileSystemEntityBase } from "./db";

export const createFolder = async (data: FileSystemEntityBase) => {
  if (!data.name.trim()) return;

  await db.entities.add({
    ...data,
    type: "folder",
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
  });
};

export const createFile = async (data: FileSystemEntityBase) => {
  if (!data.name.trim()) return;

  await db.entities.add({
    ...data,
    type: "file",
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
  });
};
