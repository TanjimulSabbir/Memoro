import Dexie, { Table } from "dexie";

// Type Definitions
export interface Folder {
  id: string; // UUID or custom ID
  name: string;
  parentId?: string | null; // null for root folder
  createdAt: Date;
  updatedAt: Date;
  type: "folder";
}

export interface File {
  id: string;
  name: string;
  parentId: string; // must belong to a folder
  content: string;
  createdAt: Date;
  updatedAt: Date;
  type: "file";
}

// Dexie Database
class MemoroFileSystemDB extends Dexie {
  folders!: Table<Folder>;
  files!: Table<File>;

  constructor() {
    super("MemoroFileSystemDB");

    this.version(1).stores({
      folders: "id, parentId, name, createdAt",
      files: "id, parentId, name, createdAt",
    });
  }
}

export const db = new MemoroFileSystemDB();
