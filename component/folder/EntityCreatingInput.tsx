import { Input } from "@/components/ui/input";
import { useGetEntities } from "@/db/useGetEntities";
import { FileText, FolderIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { CreateEntityType } from "../Sidebar/SideBar";

type DynamicInputProps = {
    createEntityType: CreateEntityType;
    entity: any;
    onSubmit: (value: string, type: "FOLDER" | "FILE") => void;
    onCancel: (type: "FOLDER" | "FILE") => void;
    parentRef: React.RefObject<HTMLDivElement | null>;
};

const DynamicInput: React.FC<DynamicInputProps> = ({
    createEntityType,
    entity,
    onSubmit,
    onCancel,
    parentRef
}) => {
    const [inputText, setInputText] = useState(createEntityType.rightClickType === "RENAME" ? entity?.folderName || entity?.fileName || "" : "");
    const [error, setError] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    const entities = useGetEntities();

    const checkDuplicate = (): boolean => {
        if (!inputText.trim() || !entities) return false;

        const normalizedInput = inputText?.trim().toLowerCase();

        const siblings = entities.filter(
            (e) => e.parentId === entity.parentId && e.id !== entity.id
        );

        const duplicateInSiblings = siblings.some((s) => {
            const folderName = s.folderName;
            const fileName = s.fileName;
            return folderName === normalizedInput || fileName === normalizedInput;
        });

        if (duplicateInSiblings) return true;


        // 2️⃣ Check parent name
        if (entity.parentId) {
            const parent = entities.find((e) => e.id === entity.parentId);
            if (parent) {
                const parentName =
                    parent.type === "FOLDER" ? parent.folderName : parent.fileName;
                if (parentName?.trim().toLowerCase() === normalizedInput) return true;
            }
        }

        // 3️⃣ Check children of current entity
        const children = entity.children || [];
        if (
            children.some(
                (child: any) =>
                    child.folderName?.trim().toLowerCase() === normalizedInput ||
                    child.fileName?.trim().toLowerCase() === normalizedInput
            )
        )
            return true;

        return false;
    };

    const handleSubmit = () => {
        if (inputText.trim().length === 0) return;

        if (checkDuplicate()) {
            setError(`${inputText} with this name already exists in the hierarchy`);
            return;
        }

        if (inputText.trim().length > 25) {
            setError("Name must be between 1 and 20 characters");
            return;
        }

        setError("");
        onSubmit(inputText, createEntityType.type);
    };

    // Outside click
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event?.target as Node;
            // If click is on parent (optional), ignore
            if (parentRef?.current?.contains(target)) return; // uncomment if needed
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                if (inputText.trim().length === 0 || createEntityType.rightClickType === "RENAME") {
                    return onCancel?.(createEntityType.type);
                }
                handleSubmit();
            }
        };
        window.addEventListener("mousedown", handleClickOutside);
        return () => window.removeEventListener("mousedown", handleClickOutside);
    }, [inputText, entities]);

    return (
        <div ref={wrapperRef} className="flex items-center space-x-1 font-Domine">
            <p className={!!error ? "mb-8" : ""}>
                {createEntityType.type === "FOLDER" ? <FolderIcon className="w-4 h-4 text-prime" strokeWidth={1.5} /> : <FileText className="w-4 h-4 text-sky-500" strokeWidth={1.5} />}
            </p>
            <p>
                <Input
                    placeholder={(createEntityType.type === "FOLDER" ? "New folder name" : "New file name")}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit();
                        if (e.key === "Escape") onCancel?.(createEntityType.type);
                    }}
                    autoFocus
                    aria-invalid={!!error}
                    className={`${createEntityType.rightClickType === "CREATE" ? "mt-3" : "mt-0"} w-full text-xs px-2 py-1 h-auto bg-transparent focus:ring-0 border-none placeholder:text-xs ${error ? "relative text-xs text-red-500" : ""
                        }`}
                />

                {error && (
                    <small className=" top-0 left-0 text-[10px] font-PtSerif font-light text-red-500 ml-1 mt-1.5 block">
                        {error}
                    </small>
                )}
            </p>
        </div>
    );
};

export default DynamicInput;
