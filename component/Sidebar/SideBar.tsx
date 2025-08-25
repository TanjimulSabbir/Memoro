"use client";
import TopBox from "./TopBox";
import ShowFolder from "../folder/ShowFolder";
import { useState, useCallback, useEffect } from "react";
import { db } from "@/db/db";
import { useLiveQuery } from "dexie-react-hooks";

export default function SideBar() {
    // ✅ live query all entities as a nested tree
    const entities = useLiveQuery(async () => {
        const [folders, files] = await Promise.all([db.folders.toArray(), db.files.toArray()]);
        const allEntities = [...folders, ...files];

        const map = new Map<string, any>();
        allEntities.forEach((entity) => map.set(entity.id, { ...entity, children: [] }));

        const roots: any[] = [];
        allEntities.forEach((entity) => {
            const node = map.get(entity.id);
            if (entity.parentId) {
                const parent = map.get(entity.parentId);
                if (parent) parent.children.push(node);
                else roots.push(node);
            } else {
                roots.push(node);
            }
        });

        const sortChildren = (nodes: any[]) => {
            nodes.sort((a, b) => b.createdAt - a.createdAt);
            nodes.forEach((n) => n.children.length && sortChildren(n.children));
        };
        sortChildren(roots);

        return roots;
    }, [], []);

    const [createEntityType, setCreateEntityType] = useState<{
        createBy: "button" | null;
        type: "file" | "folder";
        parentId?: string | null;
    }>({ createBy: null, type: "folder", parentId: null });

    const [searchText, setSearchText] = useState<string>("");
    const [results, setResults] = useState<any[]>([]);

    // ✅ update create entity type
    const handleCreateEntityTypeChange = useCallback(
        (createBy: "button" | null, type: "file" | "folder", parentId?: string | null) => {
            setCreateEntityType({ createBy, type, parentId });
        },
        []
    );

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
