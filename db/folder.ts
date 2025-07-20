import { Folder } from "./dbTypes";
import db from "./index";

export function addFolder(
  folder: Omit<Folder, "id" | "createdAt">
): Promise<number> {
  return db.folders.add({
    ...folder,
    createdAt: new Date(),
  });
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
