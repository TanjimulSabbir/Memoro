import { db, File, Folder } from '@/db/db';
import { EntityDelete } from '@/utils/EntityDelete';
import {
    Download,
    FilePlus,
    FolderOpen,
    FolderPlus,
    Info,
    Pencil,
    Settings,
    Share2,
    Trash2
} from "lucide-react";
import React from 'react';

export default function ContextMenu({ contextMenu, handleCreateEntityByRightClick }: { contextMenu: { entity: Folder | File | null; x: number; y: number; visible: boolean }; setContextMenu: React.Dispatch<React.SetStateAction<{ entity: Folder | File | null; x: number; y: number; visible: boolean }>>; handleCreateEntityByRightClick: (selectMenuTpye: "folder" | "file") => void; }) {
    console.log(contextMenu, "contextMenu");

    type menuClickType = "DELETE" | "RENAME" | "SHARE" | "OPEN" | "DOWNLOAD" | "SETTINGS" | "PROPERTIES"

    const handleMenuClick = async (menuType: menuClickType) => {
        switch (menuType) {
            case "DELETE":
                if (contextMenu.entity) {
                    await EntityDelete(contextMenu.entity);
                }
                break;
            case "RENAME":
                console.log("Rename");
                break;
            case "SHARE":
                console.log("Share");
                break;
            case "OPEN":
                console.log("Open");
                break;
            case "DOWNLOAD":
                console.log("Download");
                break;
            case "SETTINGS":
                console.log("Settings");
                break;
            case "PROPERTIES":
                console.log("Properties");
                break;
        }
    }

    return (
        <div
            className="absolute z-50"
            style={{ top: contextMenu.y, left: contextMenu.x }}
        >
            <ul className="w-60 bg-white dark:bg-neutral-900 dark:text-neutral-200 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-700 py-2 animate-fadeIn z">

                {/* Create New */}
                {contextMenu.entity?.type === "folder" && (
                    <>
                        <li
                            className="px-4 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white cursor-pointer transition-all duration-200"
                            onClick={() => handleCreateEntityByRightClick("folder")}
                        >
                            <FolderPlus className="w-4 h-4" /> New Folder
                        </li>
                        <li
                            className="px-4 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white cursor-pointer transition-all duration-200"
                            onClick={() => handleCreateEntityByRightClick("file")}
                        >
                            <FilePlus className="w-4 h-4" /> New File
                        </li>

                        <hr className="my-2 border-gray-200 dark:border-neutral-700" /></>
                )}

                {/* File Actions */}
                <li
                    className="px-4 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer transition-all duration-150"
                    onClick={() => console.log("Open")}
                >
                    <FolderOpen className="w-4 h-4" /> Open
                </li>
                <li
                    className="px-4 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer transition-all duration-150"
                    onClick={() => console.log("Download")}
                >
                    <Download className="w-4 h-4" /> Download
                </li>
                <li
                    className="px-4 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer transition-all duration-150"
                    onClick={() => console.log("Share")}
                >
                    <Share2 className="w-4 h-4" /> Share
                </li>

                <hr className="my-2 border-gray-200 dark:border-neutral-700" />

                {/* Edit */}
                <li
                    className="px-4 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer transition-all duration-150"
                    onClick={() => console.log("Rename")}
                >
                    <Pencil className="w-4 h-4" /> Rename
                </li>
                <li
                    className="px-4 py-2 flex items-center gap-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer transition-all duration-150"
                    onClick={() => handleMenuClick("DELETE")}
                >
                    <Trash2 className="w-4 h-4" /> Delete
                </li>

                <hr className="my-2 border-gray-200 dark:border-neutral-700" />

                {/* Utilities */}
                <li
                    className="px-4 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer transition-all duration-150"
                    onClick={() => console.log("Settings")}
                >
                    <Settings className="w-4 h-4" /> Settings
                </li>
                <li
                    className="px-4 py-2 flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer transition-all duration-150"
                    onClick={() => console.log("Properties")}
                >
                    <Info className="w-4 h-4" /> Properties
                </li>
            </ul>
        </div>
    )
}
