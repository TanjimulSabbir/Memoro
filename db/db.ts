import Dexie, { Table } from "dexie";

export interface Folder {
  id: string;
  parentId: string | null;
  folderName: string;
  createdAt: number;
  updatedAt: number;
  type: "FOLDER";
}
export interface File {
  id: string;
  parentId: string | null;
  fileName: string;
  note: string;
  editorType?: "simple" | "sticky" | "mdx";
  stickyColor?: string; // used when editorType === 'sticky'
  createdAt: number;
  updatedAt: number;
  type: "FILE";
}

export class MemoroDatabase extends Dexie {
  folders!: Table<Folder, string>;
  files!: Table<File, string>;

  constructor() {
    super("MemoroDatabase");
    this.version(1).stores({
      folders: "id, parentId, folderName, createdAt, updatedAt",
      files: "id, parentId, fileName, createdAt, updatedAt",
    });
  }
}

export const db = new MemoroDatabase();
