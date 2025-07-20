import { Note } from "./dbTypes";
import db from "./index";

export function addNote(
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<number> {
  const now = new Date();
  return db.notes.add({
    ...note,
    createdAt: now,
    updatedAt: now,
  });
}

export function getNotesInFolder(folderId: number): Promise<Note[]> {
  return db.notes.where("folderId").equals(folderId).toArray();
}

export function updateNote(
  id: number,
  updates: Partial<Omit<Note, "id" | "createdAt">>
): Promise<number> {
  return db.notes.update(id, {
    ...updates,
    updatedAt: new Date(),
  });
}

export function deleteNote(id: number): Promise<void> {
  return db.notes.delete(id);
}
