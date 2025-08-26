"use client";

import { Button } from "@/components/ui/button";
import { db, File, Folder } from "@/db/db";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function EntityDelete(entity: File | Folder, onClose?: () => void) {
    if (!entity) return;

    const entityName = "fileName" in entity ? entity.fileName : entity.folderName;

    toast(
        <div className="flex flex-col gap-4 min-w-[280px]">
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

                                await db.files.delete(entity.id);
                            } else if ("folderName" in entity) {
                                await db.folders.delete(entity.id);
                            }
                            toast.success("Deleted successfully!", {
                                position: "bottom-right",
                                duration: 3000,
                            })

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
