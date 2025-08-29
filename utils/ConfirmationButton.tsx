"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { deleteEntityRecursive } from "@/db/delete";

interface DeleteConfirmationButtonProps {
    entity: any;
    onClose: () => void; // required
}

export function DeleteConfirmationButton({ entity, onClose }: DeleteConfirmationButtonProps) {
    
    const handleDelete = async () => {
        try {
            await deleteEntityRecursive(entity);
        } catch (err) {
            console.error("Delete failed:", err);
        } finally {
            onClose(); // close modal after delete
        }
    };

    console.log(entity,"from DeleteConfirmationButton");

    return (
        <div>
            <AlertDialog open={true} onOpenChange={onClose}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete "{'fileName' in entity ? entity?.fileName :
                                entity?.folderName}"
                            {entity.type === "FOLDER" && entity?.children?.length
                                ? ` and its ${entity?.children.length} children`
                                : ""}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
     </div>
    );
}
