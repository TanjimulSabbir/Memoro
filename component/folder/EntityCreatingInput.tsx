import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

type DynamicInputProps = {
    placeholder?: string;
    defaultValue?: string;
    entityType: "FOLDER" | "FILE";
    onSubmit: (value: string, type: "FOLDER" | "FILE") => void;
    onCancel?: (type: "FOLDER" | "FILE") => void;
};

const DynamicInput: React.FC<DynamicInputProps> = ({
    placeholder,
    defaultValue = "",
    entityType,
    onSubmit,
    onCancel,
}) => {
    const [inputText, setInputText] = useState<string>(defaultValue);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // while user creating entity is ended (outside of input click, enter and onBlur)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                if (inputText.trim()) {
                    // If input has value, submit it
                    onSubmit(inputText, entityType);
                } else {
                    // If input empty, just cancel
                    // onCancel?.(entityType);
                }
            }
        };

        window.addEventListener("mousedown", handleClickOutside);
        return () => window.removeEventListener("mousedown", handleClickOutside);
    }, [entityType, onSubmit, onCancel]);

    return (
        <div ref={wrapperRef} className="font-Domine">
            <Input
                defaultValue={defaultValue}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && inputText.trim()) {
                        onSubmit(inputText, entityType,);
                    }
                    if (e.key === "Escape") {
                        // onCancel?.(entityType);
                    }
                }}
                autoFocus
                placeholder={placeholder || (entityType === "FOLDER" ? "New folder name" : "New file name")}
                className="mt-3 w-full text-xs px-2 py-1 h-auto bg-transparent focus:ring-0 border-none placeholder:text-xs"
            />
            {inputText.length > 25 && <small className="text-[8px] font-light text-red-500 text-justify ml-1 -mt-2">Name must be between 1 and 20 characters</small>}
        </div>
    );
};

export default DynamicInput;
