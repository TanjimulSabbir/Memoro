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
