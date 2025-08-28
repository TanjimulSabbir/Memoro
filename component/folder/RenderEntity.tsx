"use client";

import { EntityCreationStateProps } from "@/types/types";
import { FileText, FolderIcon, LucideChevronLeft } from "lucide-react";
import React, { useRef, useState } from "react";
import DynamicInput from "./EntityCreatingInput";

interface EntityRendererProps {
    entity: any;
    entityCreationsState: EntityCreationStateProps | null;
    setEntityCreationsState: (value: EntityCreationStateProps) => void;
    handleOnMenuContext: (e: React.MouseEvent<HTMLDivElement>, entity: any) => void;
}

export default function EntityRenderer({ props }: { props: EntityRendererProps }) {
    const { entity, entityCreationsState, setEntityCreationsState, handleOnMenuContext } = props;
    const { contextMenu, entityCreationMethod, entityCreationType, rightMenuClick } = entityCreationsState || {};
    // Track folder open/close state
    const [isOpen, setIsOpen] = useState(false);
    const toggleFolder = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };
    const parentRef = useRef<HTMLDivElement>(null);
    const inputOpen = ["CREATE", "RENAME"];
    return (
        <li className="flex flex-col gap-2 group mt-2 rounded group pr-1 py-0.5 hover:bg-muted/10 transition">
            {entity.type === "FOLDER" ? (
                <div className="w-full">
                    {/* here all the folder is rendering and onClick open and closing the folder. OnContext */}
                    {!(inputOpen.includes(entityCreationMethod ?? "") && entity.id === contextMenu?.entity?.id) ?
                        (
                            <div ref={parentRef} className="flex items-center justify-between cursor-pointer"
                                onClick={toggleFolder}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    handleOnMenuContext(e, entity);
                                }}>
                                <p className="flex items-center space-x-1 text-black dark:text-white text-sm font-PtSerif"
                                >
                                    <FolderIcon className="w-4 h-4 text-prime" strokeWidth={1.5} />
                                    <span>{entity.folderName}</span>
                                </p>
                                {entity.children && entity.children.length > 0 && <LucideChevronLeft className={`w-3 h-3 ${isOpen ? "rotate-90" : "rotate-180"} duration-300 transition-transform`} />}
                            </div>
                        ) :
                        <DynamicInput
                            props={{
                                entityCreationsState,
                                entity: entity,
                                parentRef: parentRef,
                                setEntityCreationsState
                            }}
                        />}

                    {/* Render children recursively if folder is open */}
                    {isOpen && entity.children && entity.children.length > 0 && (
                        <ul className="ml-2 pl-1 mt-1">
                            {entity.children.map((child: any) => (
                                <EntityRenderer
                                    key={child.id}
                                    props={{
                                        entity: child,
                                        entityCreationsState,
                                        setEntityCreationsState,
                                        handleOnMenuContext
                                    }}
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
                    {!(inputOpen.includes(entityCreationMethod ?? "") && entity.id === contextMenu?.entity?.id) ? (
                        <p
                            ref={parentRef} className="flex items-center text-black dark:text-white font-PtSerif space-x-1 text-sm cursor-pointer"
                        >
                            <FileText className="w-4 h-4 text-sky-500" strokeWidth={1.5} />
                            <span>{entity.fileName}</span>
                        </p>
                    ) : (
                        <DynamicInput
                            props={{
                                entityCreationsState,
                                entity: entity,
                                parentRef: parentRef,
                                setEntityCreationsState
                            }}
                        />
                    )}

                </div>
            )}
        </li>
    );
}
