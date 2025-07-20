import Dexie, { Table } from "dexie";
import { Folder, Note } from "./dbTypes";

class MemoroDB extends Dexie {
  folders!: Table<Folder, number>;
  notes!: Table<Note, number>;

  constructor() {
    super("memoro");
    this.version(1).stores({
      folders: "++id, parentId, name, createdAt",
      notes: "++id, folderId, title, content, createdAt, updatedAt",
    });
  }
}

const db = new MemoroDB();

export default db;
