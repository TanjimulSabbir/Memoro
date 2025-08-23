import React, { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";

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
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                if (inputRef.current.trim()) {
                    // If input has value, submit it
                    onSubmit(inputRef.current, entityType);
                } else {
                    // If input empty, just cancel
                    onCancel?.(entityType);
                }
            }
        };

        window.addEventListener("mousedown", handleClickOutside);
        return () => window.removeEventListener("mousedown", handleClickOutside);
    }, [entityType, onSubmit, onCancel]);

    return (
        <div ref={wrapperRef}>
            <Input
                defaultValue={defaultValue}
                onChange={(e) => {
                    inputRef.current = e.target.value;
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && inputRef.current.trim()) {
                        onSubmit(inputRef.current, entityType);
                    }
                    if (e.key === "Escape") {
                        onCancel?.(entityType);
                    }
                }}
                autoFocus
                placeholder={placeholder || (entityType === "folder" ? "New folder name" : "New file name")}
                className="mt-3 w-full text-sm px-2 py-1 h-auto bg-transparent focus:ring-0 border-none placeholder:text-xs"
            />
        </div>
    );
};

export default DynamicInput;
