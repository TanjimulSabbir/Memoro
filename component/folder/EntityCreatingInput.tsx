import { Input } from "@/components/ui/input";
import { handleCreateAndUpdateEntity } from "@/db/CreateEntity";
import { useGetFlatAllEntities } from "@/db/useGetEntities";
import { EntityCreationStateProps } from "@/types/types";
import { FileText, FolderIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type DynamicInputProps = {
    setEntityCreationsState: (value: EntityCreationStateProps) => void;
    entityCreationsState: EntityCreationStateProps | null;
    entity: any;
    parentRef?: React.RefObject<HTMLDivElement | null>;

};

const EntityCreatingInput = ({ props }: { props: DynamicInputProps }) => {
    const { entity, entityCreationsState, setEntityCreationsState, parentRef } = props;
    const { entityCreationMethod, entityCreationType, rightMenuClick, contextMenu } = entityCreationsState || {};
    const [inputText, setInputText] = useState(
        entity?.rightClickType === "RENAME"
            ? entity?.folderName || entity?.fileName || ""
            : ""
    );
    const [error, setError] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);
    // const [allFlatData, setAllFlatData] = useState<any[]>([]);
    const allFlatData = useGetFlatAllEntities();

    // put these tiny helpers at module scope if you like
    const normalize = (text?: string) => (text ?? "").trim().toLowerCase();
    const getEntityName = (entity: any) => entity?.folderName ?? entity?.fileName ?? "";

    const checkDuplicate = (): boolean => {
        if (!allFlatData || !inputText.trim()) return false;
        console.log(allFlatData, "entities");

        const target = normalize(inputText);


        // Check for duplicates in the root level
        if (entity?.parentId === null) {
            const nullEntities = allFlatData.filter((e) => e.parentId === null);
            if (nullEntities.some((e) => normalize(getEntityName(e)) === target && e.id !== entity.id)) {
                return true;
            }
        }

        // 1) Parent name (parent is always a folder in typical trees)
        if (entity?.parentId) {
            const parent = allFlatData.find((e) => e.parentId === entity?.parentId);
            if (parent && normalize(getEntityName(parent)) === target && parent.id !== entity?.parentId) {
                return true;
            }
        }

        // parent children (siblings)
        if (entity?.parentId) {
            const siblings = allFlatData.filter((e) => e.parentId === entity.parentId);
            if (siblings && siblings.some((sibling: any) => normalize(getEntityName(sibling)) === target && sibling.id !== entity.id)) {
                return true;
            }
        }

        // Entity's own Children
        const children: any[] = allFlatData.filter((e) => e.parentId === entity?.id);
        console.log(children, "children");

        if (children.some((c) => normalize(getEntityName(c)) === target && c.id !== entity?.id)) {
            return true;
        }

        return false;
    };


    const handleSubmit = () => {
        const trimmed = inputText.trim();
        if (!trimmed) return;

        if (trimmed.length > 25) {
            setError("Name must be between 1 and 20 characters");
            return;
        }

        if (checkDuplicate()) {
            setError(`${trimmed} with this name already exists in the hierarchy`);
            return;
        }

        setError("");
        handleCreateAndUpdateEntity(entityCreationsState, setEntityCreationsState);
    };

    // ✅ Outside click: submit or cancel
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (wrapperRef.current?.contains(target)) return;
            if (parentRef?.current?.contains(target)) return;

            if (!inputText.trim() || rightMenuClick === "RENAME") {
                setEntityCreationsState({ entityName: "", entityCreationMethod: null, entityCreationType: null, entity: null, rightMenuClick: null, contextMenu: { entity: null, x: 0, y: 0, visible: false } });
            } else {
                handleSubmit();
            }
        };

        window.addEventListener("mousedown", handleClickOutside);
        return () => window.removeEventListener("mousedown", handleClickOutside);
    }, [inputText, rightMenuClick]);

    return (
        <div ref={wrapperRef} className={`${rightMenuClick == "CREATE" && "mt-3"} relative flex items-center space-x-1 font-Domine`}>
            <p className="absolute top-1.5 left-0">
                {entityCreationType === "FOLDER" ? (
                    <FolderIcon className="w-4 h-4 text-prime" strokeWidth={1.5} />
                ) : (
                    <FileText className="w-4 h-4 text-sky-500" strokeWidth={1.5} />
                )}
            </p>
            <div className="flex flex-col w-full pl-6">
                <Input
                    placeholder={
                        entityCreationType === "FOLDER"
                            ? "New folder name"
                            : "New file name"
                    }
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateAndUpdateEntity(entityCreationsState, setEntityCreationsState);
                        if (e.key === "Escape") setEntityCreationsState({ entityName: "", entityCreationMethod: null, entityCreationType: null, entity: null, rightMenuClick: null, contextMenu: { entity: null, x: 0, y: 0, visible: false } });
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
