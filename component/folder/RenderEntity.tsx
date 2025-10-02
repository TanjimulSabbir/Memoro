"use client";

import { ContextMenu, EntityCreationStateProps } from "@/types/types";
import { FileText, FolderIcon, LucideChevronLeft } from "lucide-react";
import React, { useRef, useState } from "react";
import { useFile } from "@/contexts/file-context";
import DynamicInput from "./EntityCreatingInput";

interface EntityRendererProps {
    entity: any;
    entityCreationsState: EntityCreationStateProps | null;
    setEntityCreationsState: (value: EntityCreationStateProps | null) => void;
    handleOnMenuContext: (e: React.MouseEvent<HTMLDivElement>, entity: any) => void;
    setContextMenu: (value: ContextMenu | null) => void;
}

export default function EntityRenderer({ props }: { props: EntityRendererProps }) {
    const { entity, entityCreationsState, setEntityCreationsState, handleOnMenuContext, setContextMenu } = props;
    const { contextMenu, rightMenuClick } = entityCreationsState || {};
    const [isOpen, setIsOpen] = useState(false);
    const { selectedFile, setSelectedFile, setFileContent, setIsEditing } = useFile();
    
    const toggleFolder = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };
    
    const handleFileClick = (file: any) => {
        if (file.type === 'FILE') {
            setSelectedFile(file);
            setFileContent(file.note || '');
            setIsEditing(true);
        }
    };
    
    const parentRef = useRef<HTMLDivElement>(null);

    return (
        <div className="flex flex-col gap-2 mt-1 transition-all duration-500 ease-in-out">
            {entity.type === "FOLDER" ? (
                <div className="w-full">
                    {/* Folder display or rename */}
                    {!(rightMenuClick === "RENAME" && entity.id === contextMenu?.entity?.id) ? (
                        <div
                            ref={parentRef}
                            className="flex items-center justify-between rounded cursor-pointer p-1 hover:bg-muted/70 hover:pl-1 transition-all duration-300"
                            onClick={toggleFolder}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                handleOnMenuContext(e, entity);
                            }}
                        >
                            <p className="flex items-center gap-1 text-black dark:text-white text-[13px] font-medium">
                                <FolderIcon className="w-4 h-4 text-prime transition-transform duration-200 hover:scale-105" strokeWidth={1.5} />
                                <span className="truncate max-w-[200px]">{entity.folderName}</span>
                            </p>
                            {entity.children && entity.children.length > 0 && (
                                <LucideChevronLeft
                                    className={`w-3 h-3 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-180"
                                        }`}
                                />
                            )}
                        </div>
                    ) : (
                        <DynamicInput
                            props={{
                                entityCreationsState,
                                entity,
                                parentRef: parentRef,
                                setEntityCreationsState,
                                setContextMenu,
                            }}
                        />
                    )}

                    {/* Input when creating inside folder */}
                    {rightMenuClick === "CREATE" && entity.id === contextMenu?.entity?.id && (
                        <div className="mt-1 ml-2">
                            <DynamicInput
                                props={{
                                    entityCreationsState,
                                    entity,
                                    parentRef: parentRef,
                                    setEntityCreationsState,
                                    setContextMenu,
                                }}
                            />
                        </div>
                    )}

                    {/* Children */}
                    {isOpen && entity.children && entity.children.length > 0 && (
                        <ul className="ml-2 mt-1 space-y-1 border-l border-muted/20">
                            {entity.children.map((child: any) => (
                                <EntityRenderer
                                    key={child.id}
                                    props={{
                                        entity: child,
                                        entityCreationsState,
                                        setEntityCreationsState,
                                        handleOnMenuContext,
                                        setContextMenu,
                                    }}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <div
                    className="w-full rounded-md px-1 py-1 hover:bg-muted/70 transition-all duration-300"
                    onContextMenu={(e) => {
                        e.preventDefault();
                        handleOnMenuContext(e, entity);
                    }}
                >
                    {/* File display or rename */}
                    {!(rightMenuClick === "RENAME" && entity.id === contextMenu?.entity?.id) ? (
                        <p
                            ref={parentRef}
                            className={`flex items-center gap-1 font-medium text-[13px] cursor-pointer transition-colors ${
                                selectedFile?.id === entity.id 
                                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded px-1' 
                                    : 'text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400'
                            }`}
                            onClick={() => handleFileClick(entity)}
                        >
                            <FileText className="w-4 h-4 text-sky-500 transition-transform group-hover:scale-105" strokeWidth={1.5} />
                            <span className="truncate max-w-[200px]">{entity.fileName}</span>
                        </p>
                    ) : (
                        <DynamicInput
                            props={{
                                entityCreationsState,
                                entity,
                                parentRef: parentRef,
                                setEntityCreationsState,
                                setContextMenu,
                            }}
                        />
                    )}

                    {/* Input when creating a file at this level */}
                    {rightMenuClick === "CREATE" && entity.id === contextMenu?.entity?.id && (
                        <div className="mt-1 ml-2 animate-fadeIn">
                            <DynamicInput
                                props={{
                                    entityCreationsState,
                                    entity,
                                    parentRef: parentRef,
                                    setEntityCreationsState,
                                    setContextMenu,
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
