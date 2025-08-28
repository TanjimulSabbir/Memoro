"use client";
import { useGetEntities } from "@/db/useGetEntities";
import { useCallback, useEffect, useState } from "react";
import ShowFolder from "../Folder/ShowFolder";
import TopBox from "./TopBox";
import { EntityCreationProps } from "@/types/types";


export default function SideBar() {
    // ✅ live query all entities as a nested tree
    const entities = useGetEntities();

    const [entityCreationsState, setEntityCreationsState] = useState<EntityCreationProps | null>(null);
    const [searchText, setSearchText] = useState<string>("");
    const [results, setResults] = useState<any[]>([]);

    // ✅ update create entity type
    const handleEntityCreationState = (entityCreationProps: EntityCreationProps, clearEntityCreationState?: boolean) => {
        if (clearEntityCreationState) {
            setEntityCreationsState(null);
        } else {
            setEntityCreationsState({ ...entityCreationProps });
        }
    };

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



    return (
        <div className="relative w-full max-w-[280px] border-r border-prime px-3 min-h-screen">
            <TopBox
                props={{
                    entityCreationsState,
                    handleEntityCreationState,
                    handleSearchTextChange
                }}
            />

            <ShowFolder
                createEntityType={createEntityType}
                handleCreateEntityTypeChange={handleCreateEntityTypeChange}
                data={results.length ? results : entities} // show filtered or full tree
            />
        </div>
    );
}
