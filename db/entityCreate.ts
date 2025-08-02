import { db, FileSystemEntityBase } from "./db";

export const createFolder = async (data: FileSystemEntityBase) => {
  if (!data.name.trim()) return;

  const folderData = {
    ...data,
    type: "folder",
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
  
  };

  if (data.parentId) {
    // Check if a folder with this parentId already exists
    const existing = await db.entities
      .where({ parentId: data.parentId, name: data.name, type: "folder" })
      .first();

    if (!existing) {
      await db.entities.add({...folderData,children:data.children});
    }
    // else: folder with same name already exists under same parent
  } else {
    // No parentId, just add it as root folder
    await db.entities.add(folderData);
  }
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
