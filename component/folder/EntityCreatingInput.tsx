import { Input } from "@/components/ui/input";
import { handleCreateAndUpdateEntity } from "@/db/CreateEntity";
import { useGetFlatAllEntities } from "@/db/useGetEntities";
import { ContextMenu, EntityCreationStateProps } from "@/types/types";
import { FileText, FolderIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type DynamicInputProps = {
    setEntityCreationsState: (value: EntityCreationStateProps | null) => void;
    entityCreationsState: EntityCreationStateProps | null;
    entity: any;
    parentRef?: React.RefObject<HTMLDivElement | null>;
    setContextMenu: (value: ContextMenu | null) => void;
};

const EntityCreatingInput = ({ props }: { props: DynamicInputProps }) => {
    const { entity, entityCreationsState, setEntityCreationsState, parentRef, setContextMenu } = props;
    const { entityCreationType, rightMenuClick } = entityCreationsState || {};

    const [inputText, setInputText] = useState(
        rightMenuClick == "RENAME" ? entity?.type === "FOLDER"
            ? entity?.folderName : entity?.fileName : ""
    );
    const [error, setError] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);
    const allFlatData = useGetFlatAllEntities();

    const normalize = (text?: string) => (text ?? "").trim().toLowerCase();
    const getEntityName = (entity: any) => entity?.folderName ?? entity?.fileName;

    const resetEntityState = () => {
        setInputText("");
        setError("");
        setContextMenu({ entity: null, x: 0, y: 0, visible: false });
        setEntityCreationsState(null);
    };

    const checkDuplicate = (): boolean => {
        if (!allFlatData || !inputText.trim()) return false;
        let parentLevel = false;
        let siblingsLevel = false;
        let childrenLevel = false;

        const targetName = normalize(inputText);
        const parentLevelCheck = allFlatData.find(item => item.parentId === entity?.parentId); // Check if parentId exists
        if (parentLevelCheck) {
            console.log(parentLevelCheck, "parent level check");
            parentLevel = normalize(getEntityName(parentLevelCheck)) === targetName;
        }

        const siblings = allFlatData.filter((e) => e.id === entity?.parentId);
        if (siblings.length) {
            console.log("Sibling level check:", siblings);
            siblingsLevel = siblings.some(
                (e) => normalize(getEntityName(e)) === targetName && e.id !== entity?.id
            );
        }

        const childLevelCheck = entity.children;
        if (childLevelCheck.length) {
            console.log("Child level check:", childLevelCheck);
            childrenLevel = childLevelCheck.some(item => normalize(getEntityName(item)) === targetName);
        }
        return parentLevel || siblingsLevel || childrenLevel;
    };

    const handleSubmit = () => {
        const trimmed = inputText.trim();

        if (!trimmed) return;
        if (trimmed.length > 20) {
            setError("Name must be 20 characters or less");
            return;
        }

        if (checkDuplicate()) {
            setError(`"${trimmed}" already exists in this folder`);
            return;
        }

        setError("");
        handleCreateAndUpdateEntity(entityCreationsState, setEntityCreationsState, trimmed);
    };

    // Handle outside click to cancel or submit
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (wrapperRef.current?.contains(target)) return;
            if (parentRef?.current?.contains(target)) return;

            if (rightMenuClick === "RENAME" || rightMenuClick === "CREATE") {
                resetEntityState();
            } else {
                handleSubmit();
            }
        };

        window.addEventListener("mousedown", handleClickOutside);
        return () => window.removeEventListener("mousedown", handleClickOutside);
    }, [inputText, rightMenuClick]);

    console.log(entityCreationsState, "entityCreationsState from EntityCreatingInput");

    return (
        <div
            ref={wrapperRef}
            className={`${rightMenuClick === "CREATE" ? "mt-3 ml-2" : ""} relative flex items-center space-x-1 font-Domine`}
        >
            <p className="absolute top-1.5 left-0">
                {entityCreationType === "FOLDER" ? (
                    <FolderIcon className="w-4 h-4 text-prime" strokeWidth={1.5} />
                ) : (
                    <FileText className="w-4 h-4 text-sky-500" strokeWidth={1.5} />
                )}
            </p>
            <div className="flex flex-col w-full pl-6">
                <Input
                    // defaultValue={entity.type === "FOLDER" ? entity?.folderName : entity?.fileName}
                    placeholder={rightMenuClick === "CREATE" ? "New folder name" : "New file name"}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}

                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit();
                        if (e.key === "Escape") resetEntityState();
                    }}
                    autoFocus
                    aria-invalid={!!error}
                    className={`w-full text-xs py-1 h-auto border-none placeholder:text-xs outline-none focus:ring-1 focus:ring-blue-500 ${error ? "text-red-500" : ""
                        }`}
                />
                {error && (
                    <small className="text-[10px] font-light text-red-500 mt-1 block">
                        {error}
                    </small>
                )}
            </div>
        </div>
    );
};

export default EntityCreatingInput;
