import { db } from "./db";

export async function deleteEntityRecursive(entity: any) {
  if (!entity) return;

  if (entity.type === "FILE") {
    await db.files.delete(entity.id);
  } else if (entity.type === "FOLDER") {
    if (entity.children && entity.children.length > 0) {
      for (const child of entity.children) {
        await deleteEntityRecursive(child);
      }
    }
    await db.folders.delete(entity.id);
  }
}
