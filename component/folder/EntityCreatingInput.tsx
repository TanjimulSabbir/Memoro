import React, { useRef } from "react";
import { Input } from "@/components/ui/input"; // shadcn/ui Input

type DynamicInputProps = {
    placeholder?: string;
    defaultValue?: string;
    entityType: "folder" | "file";
    onSubmit: (value: string, type: "folder" | "file") => void;
    onCancel?: (type: "folder" | "file") => void;
};

const DynamicInput: React.FC<DynamicInputProps> = ({
    placeholder,
    defaultValue = "",
    entityType,
    onSubmit,
    onCancel,
}) => {
    const inputRef = useRef<string>(defaultValue);

    return (
        <Input
            defaultValue={defaultValue}
            onChange={(e) => {
                inputRef.current = e.target.value; // ✅ store keystrokes in ref
            }}
            onBlur={() => {
                if (inputRef.current.trim()) {
                    onSubmit(inputRef.current, entityType);
                }
            }}
            placeholder={placeholder || (entityType === "folder" ? "New folder name" : "New file name")}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    if (inputRef.current.trim()) {
                        onSubmit(inputRef.current, entityType);
                    }
                }
                if (e.key === "Escape") {
                    onCancel?.(entityType);
                }
            }}
            autoFocus
            className="my-3 w-full text-sm px-2 py-1 h-auto bg-transparent focus:ring-0 border-none"
        />
    );
};

export default DynamicInput;
