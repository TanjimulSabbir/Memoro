import type { Folder } from '@/db/db';
import { FolderIcon } from 'lucide-react'
import React from 'react'

export default function EntityFolder({ entity, handleCreateEntityTypeChange }: { entity: Folder; handleCreateEntityTypeChange: (createdBy: "button" | null, type: "file" | "folder", parentId?: string | null) => void; }) {
    const [contextMenu, setContextMenu] = React.useState<{ x: number, y: number, visible: boolean }>({ x: 0, y: 0, visible: false });

    const handleOnMenuContext = (event: React.MouseEvent) => {
        setContextMenu({ x: event.clientX, y: event.clientY, visible: false });
        event.preventDefault();
        setContextMenu({ x: event.clientX, y: event.clientY, visible: true });
    }
    return (
        <div>
            <p className="flex items-center space-x-1 text-xs"
                onContextMenu={handleOnMenuContext}>
                <FolderIcon className="w-4 h-4 text-prime" strokeWidth={1.5} />
                <span>{entity.folderName}</span>
            </p>
            {contextMenu.visible && (
                <div
                    className="absolute z-50"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <ul className="w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-fadeIn">
                        <li
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer"
                            onClick={() =>
                                handleCreateEntityTypeChange(null, "folder", entity.id)
                            }
                        >
                            📂 New Folder
                        </li>
                        <li
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer"
                            onClick={() =>
                                handleCreateEntityTypeChange(null, "file", entity.id)
                            }
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
