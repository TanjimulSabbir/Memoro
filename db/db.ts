import Dexie, { Table } from "dexie";

// Base type
export interface FileSystemEntityBase {
  id: string;
  name: string;
  parentId: string | null;
  type: "folder" | "file";
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}


// Dexie Database
class MemoroFileSystemDB extends Dexie {
  entities!: Table<FileSystemEntityBase, string>;

  constructor() {
    super("MemoroFileSystemDB");

    this.version(2).stores({
      entities: "id, parentId, name, type, createdAt, [parentId+name]",
    });
  }
}

export const db = new MemoroFileSystemDB();
