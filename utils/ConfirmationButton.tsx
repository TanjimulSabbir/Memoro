"use client";

import { toast } from "sonner";
import { deleteEntityRecursive } from "@/db/delete";
import { AlertTriangle, FileText, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmDelete(entity: any) {
    const isFolder = entity?.type === "FOLDER";
    const childCount = isFolder ? entity?.children?.length || 0 : 0;

    toast.custom(
        (t) => (
            <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-neutral-700 p-5 w-[500px] max-w-full animate-in fade-in zoom-in">

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Permanent Delete
                    </h1>
                </div>

                {/* Body */}
                <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                        {isFolder ? (
                            <Folder className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        ) : (
                            <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                        )}
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {entity?.fileName || entity?.folderName}
                        </span>
                    </div>

                    {isFolder && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            This folder contains <span className="font-medium">{childCount}</span>{" "}
                            {childCount === 1 ? "item" : "items"} (files, folders, or notes).
                            All contents will be permanently deleted.
                        </p>
                    )}

                    <p className="text-sm text-red-600 dark:text-red-400 font-semibold mt-3">
                        Warning: This action cannot be undone!
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="outline"
                        onClick={() => toast.dismiss(t)}
                        className="px-5 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 text-sm font-medium hover:bg-gray-100 cursor-pointer dark:hover:bg-neutral-800 transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={async () => {
                            try {
                                await deleteEntityRecursive(entity);
                                toast.success("Deleted successfully ✅");
                            } catch (err) {
                                toast.error("Failed to delete ❌");
                            } finally {
                                toast.dismiss(t);
                            }
                        }}
                        className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow-md transition-colors cursor-pointer flex items-center gap-2"
                    >
                        <AlertTriangle className="w-4 h-4" /> Delete
                    </Button>
                </div>
            </div>

        ),
        { duration: Infinity } // stays until user clicks
    );
}
