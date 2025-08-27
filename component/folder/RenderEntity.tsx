"use client";

import { File, Folder } from "@/db/db";
import { FileText, FolderIcon, LucideChevronLeft } from "lucide-react";
import React, { useState } from "react";
import DynamicInput from "./EntityCreatingInput";
import { CreateEntityType } from "../Sidebar/SideBar";
import { handleCreateEntityType } from "./ShowFolder";
import { RightMenuClickType } from "./ContextMenu";

interface EntityRendererProps {
    entity: any;
    createEntityType: CreateEntityType;
    handleCreateEntityTypeChange: (createEntityType: CreateEntityType) => void;
    handleCreateEntity: (handleCreateEntityType: handleCreateEntityType) => void;
    handleOnMenuContext: (e: React.MouseEvent<HTMLDivElement>, entity: any,) => void; // ✅ Use React.MouseEvent
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
    // console.log("Toggled folder", createEntityType, entity);
    return (
        <li className="flex flex-col gap-2 group mt-2 rounded group pr-1 py-0.5 hover:bg-muted/10 transition">
            {entity.type === "FOLDER" ? (
                <div className="w-full">
                    {/* here all the folder is rendering and onClick open and closing the folder. OnContext */}
                    {!(createEntityType.createBy === "RENAME" && createEntityType.parentId === entity.id) && <div className="flex items-center justify-between cursor-pointer"
                        onClick={toggleFolder}
                        onContextMenu={(e) => {
                        e.preventDefault();
                        handleOnMenuContext(e, entity,);
                    }}>
                        <p className="flex items-center space-x-1 text-black dark:text-white text-sm font-PtSerif"
                        >
                            <FolderIcon className="w-4 h-4 text-prime" strokeWidth={1.5} />
                            <span>{entity.folderName}</span>
                        </p>
                        {entity.children && entity.children.length > 0 && <LucideChevronLeft className={`w-3 h-3 ${isOpen ? "rotate-90" : "rotate-180"} duration-300 transition-transform`} />}
                    </div>}

                    {/* Creating Entity matched with entity id*/}
                    {entity.id === createEntityType.parentId && (
                        <DynamicInput
                            placeholder={createEntityType.type === "FOLDER" ? "New folder name" : "New file name"}
                            entityType={createEntityType.type}
                            onSubmit={(val, type) => handleCreateEntity({ name: val, parentId: entity.id, type, createdBy: createEntityType.createBy })}
                            // onCancel={(type) => handleCreateEntityTypeChange(null, type)}
                            defaultValue={createEntityType.createBy === "RENAME" ? entity.folderName : ""}
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
                    {createEntityType.createBy !== "RENAME" ? <p
                        className="flex items-center text-black dark:text-white font-PtSerif space-x-1 text-sm cursor-pointer"
                    >
                        <FileText className="w-4 h-4 text-sky-500" strokeWidth={1.5} />
                        <span>{entity.fileName}</span>
                    </p> : <DynamicInput
                        placeholder={createEntityType.type === "FOLDER" ? "New folder name" : "New file name"}
                        entityType={createEntityType.type}
                        onSubmit={(val, type) => handleCreateEntity({ name: val, parentId: entity.id, type, createdBy: createEntityType.createBy })}
                        // onCancel={(type) => handleCreateEntityTypeChange(null, type)}
                        defaultValue={entity.fileName}
                    />}

                </div>
            )}
        </li>
    );
}
