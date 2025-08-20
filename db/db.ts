import Dexie, { Table } from "dexie";

export interface Folder {
  id: string;
  parentId: string | null;
  folderName: string;
  createdAt: number;
  updatedAt: number;
  type: "folder";
}
export interface File {
  id: string;
  parentId: string | null;
  fileName: string;
  note: string;
  createdAt: number;
  updatedAt: number;
  type: "file";
}

export class MemoroDatabase extends Dexie {
  folders!: Table<Folder, number>;
  files!: Table<File, number>;

  constructor() {
    super("MemoroDatabase");
    this.version(1).stores({
      folders: "id, parentId, folderName, createdAt, updatedAt",
      files: "id, parentId, fileName, createdAt, updatedAt",
    });
  }
}

export const db = new MemoroDatabase();
