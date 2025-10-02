"use client";
import { useGetEntities } from "@/db/useGetEntities";
import { useCallback, useEffect, useState } from "react";
import ShowFolder from "../Folder/ShowFolder";
import TopBox from "./TopBox";
import { EntityCreationStateProps } from "@/types/types";

export default function SideBar() {
    // ✅ live query all entities as a nested tree
    const entities = useGetEntities();
    const [entityCreationsState, setEntityCreationsState] = useState<EntityCreationStateProps | null>(null);
    const [searchText, setSearchText] = useState<string>("");
    const [results, setResults] = useState<any[]>([]);

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


    console.log(entityCreationsState, "entityCreationsState from sidebar");

    return (
        <div className="relative w-full max-w-[280px] border-r border-prime dark:border-gray-700 px-3 min-h-screen bg-gray-50 dark:bg-transparent transition-colors">
            <TopBox
                props={{
                    entityCreationsState,
                    setEntityCreationsState,
                    handleSearchTextChange
                }}
            />

            <ShowFolder
                props={{
                    entityCreationsState,
                    setEntityCreationsState,
                    handleSearchTextChange,
                    data: results.length ? results : entities
                }}
            />
        </div>
    );
}
