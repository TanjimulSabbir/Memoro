import Dexie from "dexie";

const db = new Dexie("MyNotesDatabase");

db.version(1).stores({
  folders: "++id, name",
  notes: "++id, folderId, title, createdAt",
});

export async function createFolder(name:string) {
  const id = await db.folders.add({ name });
  console.log(`Folder created with id ${id}`);
  return id;
}

export async function createNote(folderId, title, content) {
  const id = await db.notes.add({
    folderId,
    title,
    content,
    createdAt: new Date(),
  });
  console.log(`Note created with id ${id}`);
  return id;
}

// Get all folders
export async function getFolders() {
  return await db.folders.toArray();
}

// Get all notes in a folder
export async function getNotesByFolder(folderId) {
  return await db.notes.where("folderId").equals(folderId).toArray();
}
