"use client";
import { db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect, useState } from "react";
import ShowFolder from "../folder/ShowFolder";
import TopBox from "./TopBox";
import { RightMenuClickType } from "../folder/ContextMenu";
import { useGetEntities } from "@/db/useGetEntities";

export type createdBy = "BUTTON" | "RIGHTCLICK" | null
export type CreateEntityType = {
    createBy: createdBy;
    type: "FILE" | "FOLDER";
    parentId: string | null;
    rightClickType: RightMenuClickType | null
}


export default function SideBar() {
    // ✅ live query all entities as a nested tree
    const entities = useGetEntities();

    const [createEntityType, setCreateEntityType] = useState<CreateEntityType>({ createBy: null, type: "FOLDER", parentId: null, rightClickType: null });

    const [searchText, setSearchText] = useState<string>("");
    const [results, setResults] = useState<any[]>([]);

    // ✅ update create entity type
    const handleCreateEntityTypeChange = (createEntityType: CreateEntityType) => (setCreateEntityType({ ...createEntityType }));

    // ✅ debounce
    const debounce = (fn: (...args: any[]) => void, delay: number) => {
        let timer: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    const handleSearchTextChange = useCallback(
        debounce((value: string) => {
            setSearchText(value.trim().toLowerCase());
        }, 500),
        []
    );

    // ✅ filter entities in memory
    useEffect(() => {
        if (!entities) return;

        if (!searchText) {
            setResults([]);
            return;
        }

        // recursive search including all children of a matched folder
        const searchTree = (nodes: any[]): any[] => {
            const res: any[] = [];

            for (const node of nodes) {
                let matched = false;

                if ("folderName" in node && node.folderName.toLowerCase().includes(searchText)) {
                    matched = true;
                }

                if ("fileName" in node && node.fileName.toLowerCase().includes(searchText)) {
                    matched = true;
                }

                let childMatches: any[] = [];

                if ("folderName" in node && node.folderName.toLowerCase().includes(searchText)) {
                    // ✅ if folder matched, include all children
                    childMatches = node.children || [];
                } else {
                    // search children recursively
                    childMatches = searchTree(node.children || []);
                }

                if (matched || childMatches.length) {
                    res.push({ ...node, children: childMatches });
                }
            }

            return res;
        };

        const filtered = searchTree(entities);
        setResults(filtered);
    }, [searchText, entities]);

    console.log({ createEntityType }, "from createEntityType");


    return (
        <div className="relative w-full max-w-[280px] border-r border-gray-300 px-3 min-h-screen">
            <TopBox
                createEntityType={createEntityType}
                handleCreateEntityTypeChange={handleCreateEntityTypeChange}
                handleSearchTextChange={handleSearchTextChange}
            />

            <ShowFolder
                createEntityType={createEntityType}
                handleCreateEntityTypeChange={handleCreateEntityTypeChange}
                data={results.length ? results : entities} // show filtered or full tree
            />
        </div>
    );
}
