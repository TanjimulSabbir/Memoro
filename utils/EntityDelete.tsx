"use client";

import { toast } from "sonner";
import { db, File, Folder } from "@/db/db";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function EntityDelete(entity: File | Folder, onClose?: () => void) {
    if (!entity) return;

    const entityName = "fileName" in entity ? entity.fileName : entity.folderName;

    // Convert ID to number
    const id = Number(entity.id);
    if (isNaN(id)) {
        console.error("Invalid entity id:", entity.id);
        return toast.error("Cannot delete: invalid ID");
    }

    toast(
        <div className="flex flex-col gap-4 p-4 min-w-[280px] bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow">
            <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Confirm Deletion
                </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete{" "}
                <span className="font-bold text-gray-900 dark:text-gray-100">{entityName}</span>?
            </p>

            <div className="flex justify-end gap-3 mt-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    onClick={() => toast.dismiss()}
                >
                    Cancel
                </Button>

                <Button
                    variant="destructive"
                    size="sm"
                    className="hover:bg-gray-900 dark:hover:bg-gray-200 transition text-white dark:text-black"
                    onClick={async () => {
                        try {
                            if ("fileName" in entity) {
                                await db.files.delete(id);
                            } else if ("folderName" in entity) {
                                await db.folders.delete(id);
                            }

                            toast.message("Deleted successfully", {
                                description: `"${entityName}" has been deleted.`,
                            });
                        } catch (err) {
                            console.error("Delete failed:", err);
                            toast.error("Failed to delete");
                        } finally {
                            onClose?.();
                            toast.dismiss();
                        }
                    }}
                >
                    Delete
                </Button>
            </div>
        </div>,
        { duration: Infinity }
    );
}
