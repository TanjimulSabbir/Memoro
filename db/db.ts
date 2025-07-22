import Dexie, { Table } from "dexie";
import { FilesItem, Folder, Note } from "./dbTypes";

class MemoroDB extends Dexie {
  folders!: Table<Folder, number>;
  files!: Table<FilesItem, number>;
  notes!: Table<Note, number>;

  constructor() {
    super("memoro");
    this.version(2).stores({
      folders: "++id, parentId, name, createdAt",
      files: "++id, folderId, name, createdAt",
      notes: "++id, folderId, title, content, createdAt, updatedAt",
    });
  }
}

const db = new MemoroDB();

export default db;
