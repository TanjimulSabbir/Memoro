import db from "./db";
import { FilesItem } from "./dbTypes";

// Add a file under a specific folder (folderId required)
export function addFileToFolder(
  file: Omit<FilesItem, "id" | "createdAt">
): Promise<number> {
  const { folderId, name, content } = file;
  return db.files.add({
    folderId,
    name,
    content,
    createdAt: new Date(),
  });
}

export function getFilesByFolder(folderId: number): Promise<FilesItem[]> {
  return db.files.where("folderId").equals(folderId).toArray();
}

export function deleteFile(id: number): Promise<void> {
  return db.files.delete(id);
}
