"use client";

import { FileText, FolderIcon, LucideChevronRight } from "lucide-react";
import DynamicInput from "./EntityCreatingInput";
import EntityFolder from "./Folder";
import { useState } from "react";

interface EntityRendererProps {
    entity: any;
    createEntityType: { createBy: "button" | null; type: "file" | "folder"; parentId?: string | null };
    handleCreateEntityTypeChange: (createdBy: "button" | null, type: "file" | "folder", parentId?: string | null) => void;
    handleCreateEntity: (name: string, parentId: string | null, type: "file" | "folder") => void;
}

export default function EntityRenderer({
    entity,
    createEntityType,
    handleCreateEntityTypeChange,
    handleCreateEntity,
}: EntityRendererProps) {
    // Track folder open/close state
    const [isOpen, setIsOpen] = useState(false);

    const toggleFolder = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering parent clicks
        setIsOpen(!isOpen);
    };

    return (
        <li className="flex flex-col gap-1 group pr-1 py-0.5 rounded hover:bg-muted/60 transition">
            {entity.type === "folder" ? (
                <div className="w-full">
                    {/* Folder header */}
                    <div className="flex items-center justify-between cursor-pointer" onClick={toggleFolder}>
                        <EntityFolder entity={entity} handleCreateEntityTypeChange={handleCreateEntityTypeChange} />
                        <LucideChevronRight className={`${isOpen && entity.children && entity.children.length > 0 ? "rotate-90" : "rotate-180"} duration-300 transition-transform`} />
                    </div>

                    {/* Dynamic input for adding new entity under this folder */}
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
                                />
                            ))}
                        
                        </ul>
                    )}
                </div>
            ) : (
                <div className="w-full">
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
