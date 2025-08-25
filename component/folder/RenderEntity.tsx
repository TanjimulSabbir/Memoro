"use client";

import { FileText, FolderIcon, LucideChevronLeft } from "lucide-react";
import React, { MouseEvent, useState } from "react";
import DynamicInput from "./EntityCreatingInput";
import EntityFolder from "./Folder";
import { File, Folder } from "@/db/db";

interface EntityRendererProps {
    entity: any;
    createEntityType: { createBy: "button" | null; type: "file" | "folder"; parentId?: string | null };
    handleCreateEntityTypeChange: (createdBy: "button" | null, type: "file" | "folder", parentId?: string | null) => void;
    handleCreateEntity: (name: string, parentId: string | null, type: "file" | "folder") => void;
    handleOnMenuContext: (e: React.MouseEvent<HTMLDivElement>, entity: Folder | File) => void; // ✅ Use React.MouseEvent
}

export default function EntityRenderer({
    entity,
    createEntityType,
    handleCreateEntityTypeChange,
    handleCreateEntity,
    handleOnMenuContext
}: EntityRendererProps) {
    // Track folder open/close state
    const [isOpen, setIsOpen] = useState(false);
    const toggleFolder = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <li className="flex flex-col gap-1 group pr-1 py-1 mt-2 hover:bg-muted/10 hover:rounded-xl transition">
            {entity.type === "folder" ? (
                <div className="w-full">
                    {/* here all the folder is rendering and onClick open and closing the folder. OnContext */}
                    <div className="flex items-center justify-between cursor-pointer" onClick={toggleFolder} onContextMenu={(e) => {
                        e.preventDefault();
                        handleOnMenuContext(e, entity);
                    }}>
                        <p className="flex items-center space-x-1 text-xs font-PtSerif"
                        >
                            <FolderIcon className="w-4 h-4 text-prime" strokeWidth={1.5} />
                            <span>{entity.folderName}</span>
                        </p>
                        {entity.children && entity.children.length > 0 && <LucideChevronLeft className={`w-3 h-3 ${isOpen ? "rotate-90" : "rotate-180"} duration-300 transition-transform`} />}
                    </div>

                    {/* Creating Entity matched with entity id*/}
                    {entity.id === createEntityType.parentId && (
                        <DynamicInput
                            placeholder={createEntityType.type === "folder" ? "New folder name" : "New file name"}
                            entityType={createEntityType.type}
                            onSubmit={(val, type) => handleCreateEntity(val, entity.id, type)}
                            onCancel={(type) => handleCreateEntityTypeChange(null, type)}
                        />
                    )}

                    {/* Render children recursively if folder is open */}
                    {isOpen && entity.children && entity.children.length > 0 && (
                        <ul className="ml-2 border-l border-muted/50 pl-1 mt-1">
                            {entity.children.map((child: any) => (
                                <EntityRenderer
                                    key={child.id}
                                    entity={child}
                                    createEntityType={createEntityType}
                                    handleCreateEntityTypeChange={handleCreateEntityTypeChange}
                                    handleCreateEntity={handleCreateEntity}
                                    handleOnMenuContext={handleOnMenuContext}
                                />
                            ))}

                        </ul>
                    )}
                </div>
            ) : (
                <div className="w-full" onContextMenu={(e) => {
                    e.preventDefault();
                    handleOnMenuContext(e, entity); // correct order ✅
                }}>
                    {/* File */}
                    <p
                        className="flex items-center space-x-1 text-xs cursor-pointer"
                    >
                        <FileText className="w-4 h-4 text-sky-500" strokeWidth={1.5} />
                        <span>{entity.fileName}</span>
                    </p>

                </div>
            )}
        </li>
    );
}
