import { Folder } from "./dbTypes";
import db from "./db";

export function addFolder(
  folder: Omit<Folder, "id" | "createdAt">
): Promise<number> {
  return db.folders.add({
    ...folder,
    createdAt: new Date(),
  });
}

// export function createFolder({ type, data }: { type: string, data: { name: string, content?: "", parentId?: number } }) {
//   const { name, content = "", parentId = null } = data;
//   const createdAt = new Date();
//   if (type == "file") {
//     db.folders.add(({"id",name, type, parentId, content, createdAt, updatedAt}))
//   } else {
//     db.folders.add(({"id",name, type, parentId, createdAt, updatedAt}))
//   }
// }

export function getAllFolders(): Promise<Folder[]> {
  return db.folders.toArray();
}

export function getSubfolders(
  parentId: number | null = null
): Promise<Folder[]> {
  return db.folders.where("parentId").equals(parentId).toArray();
}

export function deleteFolder(id: number): Promise<void> {
  return db.folders.delete(id);
}

export function updateFolderName(id: number, name: string): Promise<number> {
  return db.folders.update(id, { name });
}
