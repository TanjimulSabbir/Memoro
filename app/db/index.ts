import Dexie, { Table } from "dexie";

export interface Folder {
  id?: number;
  parentId: number | null;
  name: string;
  createdAt: Date;
}

export interface Note {
  id?: number;
  folderId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

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
