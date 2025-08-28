import React, { useEffect, useRef, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { useGetEntities } from "@/db/useGetEntities";

type DynamicInputProps = {
    placeholder?: string;
    defaultValue?: string;
    entityType: "FOLDER" | "FILE";
    entity: any;
    onSubmit: (value: string, type: "FOLDER" | "FILE") => void;
    onCancel?: (type: "FOLDER" | "FILE") => void;
};

const DynamicInput: React.FC<DynamicInputProps> = ({
    placeholder,
    defaultValue = "",
    entityType,
    entity,
    onSubmit,
    onCancel,
}) => {
    const [inputText, setInputText] = useState<string>(defaultValue);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // ✅ Fetch entities once (live query subscribes to DB)
    const entities = useGetEntities();

    // ✅ Pre-compute siblings once from entities (not on every keystroke)
    const map = new Map<string, any>();
    entities.forEach(entity => map.set(entity.id, entity));
    // ✅ Now only compare inputText with siblings (cheap)
    const isDuplicate = () => {
        const lowCaseInputText = inputText.trim().toLowerCase();
        const entityName = map.get(entity.id)?.type === "FOLDER" ? "folderName" : "fileName";
        if (!entity.parentId) {
            const nonParentIdEntities = entities.filter(e => !e.parentId);
            const sameLevelCheck = nonParentIdEntities.some(e => e.folderName?.toLowerCase() === lowCaseInputText || e.fileName?.toLowerCase() === lowCaseInputText && e.id !== entity.id);
            if (entity.type === "FOLDER") {
                const childLevelCheck = map.get(entity.id)?.children?.some((child: any) => child.folderName.toLowerCase() === lowCaseInputText && child.id !== entity.id);
                return sameLevelCheck || childLevelCheck;
            }

            if (sameLevelCheck) return sameLevelCheck
        }
        if (entity.parentId) {
            const parentLevelCheck = map.get(entity.parentId)?.[entityName].toLowerCase() === lowCaseInputText;
            const sameLevelCheck = map.get(entity.parentId)?.children?.some((child: any) => child.folderName.toLowerCase() === lowCaseInputText || child.fileName.toLowerCase() === lowCaseInputText && child.id !== entity.id);

            if (entity.type === "FOLDER") {
                const childLevelCheck = map.get(entity.id)?.children?.some((child: any) => child.folderName.toLowerCase() === lowCaseInputText || child.fileName.toLowerCase() === lowCaseInputText && child.id !== entity.id);
                return parentLevelCheck || sameLevelCheck || childLevelCheck;
            } else {
                if (parentLevelCheck || sameLevelCheck) return true;
            }
        }
    }


    // ✅ Outside click handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                if (inputText.trim()) {
                    onSubmit(inputText, entityType);
                } else {
                    onCancel?.(entityType);
                }
            }
        };

        window.addEventListener("mousedown", handleClickOutside);
        return () => window.removeEventListener("mousedown", handleClickOutside);
    }, [entityType, inputText, onSubmit, onCancel]);

    return (
        <div ref={wrapperRef} className="font-Domine">
            <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && inputText.trim()) {
                        onSubmit(inputText, entityType);
                    }
                    if (e.key === "Escape") {
                        onCancel?.(entityType);
                    }
                }}
                autoFocus
                placeholder={
                    placeholder ||
                    (entityType === "FOLDER" ? "New folder name" : "New file name")
                }
                className={`mt-3 w-full text-xs px-2 py-1 h-auto bg-transparent focus:ring-0 border-none placeholder:text-xs ${isDuplicate ? "border-b border-red-500" : ""
                    }`}
            />

            {/* {isDuplicate && (
                <small className="text-[10px] font-light text-red-500 ml-1 -mt-1 block">
                    {entityType} with this name already exists here
                </small>
            )} */}
            {inputText.length > 25 && (
                <small className="text-[10px] font-light text-red-500 ml-1 -mt-1 block">
                    Name must be between 1 and 20 characters
                </small>
            )}
        </div>
    );
};

export default DynamicInput;
