"use client";
import TopBox from "./TopBox";
import ShowFolder from "../folder/ShowFolder";
import { useState, useCallback, useEffect } from "react";
import { db } from "@/db/db";

export default function SideBar() {
    const [createEntityType, setCreateEntityType] = useState<{
        createBy: "button" | null;
        type: "file" | "folder";
        parentId?: string | null;
    }>({ createBy: "button", type: "folder", parentId: null });

    const [searchText, setSearchText] = useState<string>("");
    const [results, setResults] = useState<any[]>([]);

    // ✅ update create entity type
    const handleCreateEntityTypeChange = useCallback(
        (createBy: "button" | null, type: "file" | "folder", parentId?: string | null) => {
            setCreateEntityType({ createBy, type, parentId });
        },
        []
    );

    // ✅ debounce hook (500ms)
    const debounce = (fn: (...args: any[]) => void, delay: number) => {
        let timer: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    // ✅ DB search (runs only when searchText changes)
    useEffect(() => {
        if (!searchText) {
            setResults([]);
            return;
        }

        let isMounted = true;

        const fetchResults = async () => {
            const [files, folders] = await Promise.all([
                db.files.toArray(),
                db.folders.toArray(),
            ]);

            const allEntities = [...folders, ...files];

            // 1️⃣ Get all entities that match search
            const matches = allEntities.filter(
                (e) =>
                    ("folderName" in e && e.folderName.toLowerCase().includes(searchText)) ||
                    ("fileName" in e && e.fileName.toLowerCase().includes(searchText))
            );

            // 2️⃣ Include all parents of matched items
            const finalEntities = [...matches];
            const addedIds = new Set(matches.map((e) => e.id));

            for (const match of matches) {
                let parentId = match.parentId;
                while (parentId && !addedIds.has(parentId)) {
                    const parent = allEntities.find((e) => e.id === parentId);
                    if (!parent) break;
                    finalEntities.push(parent);
                    addedIds.add(parent.id);
                    parentId = parent.parentId;
                }
            }

            // 3️⃣ Build tree
            const map = new Map<string, any>();
            finalEntities.forEach((e) => map.set(e.id, { ...e, children: [] }));

            const roots: any[] = [];
            finalEntities.forEach((entity) => {
                const node = map.get(entity.id);
                if (entity.parentId && map.has(entity.parentId)) {
                    map.get(entity.parentId).children.push(node);
                } else {
                    roots.push(node);
                }
            });

            if (isMounted) setResults(roots);
        };

        fetchResults();

        return () => {
            isMounted = false;
        };
    }, [searchText]);



    // ✅ debounced input handler
    const handleSearchTextChange = useCallback(
        debounce((value: string) => {
            setSearchText(value.trim().toLowerCase());
        }, 500),
        []
    );

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
                searchResults={results}
            />

        </div>
    );
}
