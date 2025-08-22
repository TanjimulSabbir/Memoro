import type { Folder } from '@/db/db';
import { FolderIcon } from 'lucide-react'
import React from 'react'
interface props {
    entity: Folder;
    handleCreateEntityTypeChange: (createdBy: "button" | null, type: "file" | "folder", parentId?: string | null) => void
}

export default function EntityFolder({ entity, handleCreateEntityTypeChange }: props) {
    const [contextMenu, setContextMenu] = React.useState<{ entityId: string|null, x: number, y: number, visible: boolean }>({ entityId:null, x: 0, y: 0, visible: false });

    const handleOnMenuContext = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu({ entityId: entity.id, x: event.clientX, y: event.clientY, visible: true });
    }
    const handleCreateEntiyByRightClick = (selectMenuTpye: "folder" | "file") => {
        handleCreateEntityTypeChange(null, selectMenuTpye, entity.id);
        setContextMenu({ ...contextMenu, entityId:null, visible: false });
    }

    return (
        <div>
            <p className="flex items-center space-x-1 text-xs"
                onContextMenu={handleOnMenuContext}>
                <FolderIcon className="w-4 h-4 text-prime" strokeWidth={1.5} />
                <span>{entity.folderName}</span>
            </p>

            {contextMenu.visible && contextMenu.entityId === entity.id && (
                <div
                    className="absolute z-50"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <ul className="w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-fadeIn">
                        <li
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer"
                            onClick={() => handleCreateEntiyByRightClick("folder")}
                        >
                            📂 New Folder
                        </li>
                        <li
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer"
                            onClick={() => handleCreateEntiyByRightClick("file")}
                        >
                            📄 New File
                        </li>
                        <hr className="my-1 border-gray-200" />
                        <li
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer"
                            onClick={() => console.log("Rename")}
                        >
                            ✏️ Rename
                        </li>
                        <li
                            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                            onClick={() => console.log("Delete")}
                        >
                            🗑️ Delete
                        </li>
                    </ul>
                </div>
            )}

        </div>
    )
}
