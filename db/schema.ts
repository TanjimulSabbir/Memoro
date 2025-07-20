// Dexie stores schema (table and index definitions)
export const stores = {
  folders: "id, name, parentId, createdAt",
  files: "id, folderId, name, createdAt",
};
