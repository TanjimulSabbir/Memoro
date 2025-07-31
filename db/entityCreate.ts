import { db, FileSystemEntityBase } from "./db";

export const createFolder = async (data: FileSystemEntityBase) => {
  if (!data.name.trim()) return;


  
const isFolderExists= data.parentId?  db.entities.where(data.parentId):null

  isFolderExists?await db.entities.where(data.parentId).add(children:{
    ...data,
    type: "folder",
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),

  }) (): await db.entities.add({
    ...data,
    type: "folder",
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),

  });
};

// Delete Folder or File
export const deleteEntity = async (id: string) => {
  await db.entities.delete(id);
};

// Update Folder Name
export const updateFolderName = async (newName: string, id: string) => {
  const trimmedName = newName.trim();
  if (!trimmedName) return;

  await db.entities.update(id, {
    name: trimmedName,
    updatedAt: new Date(),
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
