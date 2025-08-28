"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/db";

export function useGetEntities() {
    const entities = useLiveQuery(async () => {
        const [folders, files] = await Promise.all([
            db.folders.toArray(),
            db.files.toArray(),
        ]);
        const allEntities = [...folders, ...files];

        const map = new Map<string, any>();
        allEntities.forEach((entity) =>
            map.set(entity.id, { ...entity, children: [] })
        );

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

    return entities;
}
