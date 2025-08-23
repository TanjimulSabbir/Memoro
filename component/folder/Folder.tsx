import type { Folder } from '@/db/db';
import { log } from 'console';
import { FolderIcon } from 'lucide-react';

import React from 'react';

interface props {
    entity: Folder;
    handleCreateEntityTypeChange: (createdBy: "button" | null, type: "file" | "folder", parentId?: string | null) => void;
}

export default function EntityFolder({ entity, handleCreateEntityTypeChange }: props) {
    return (
        <div>
            <p className="flex items-center space-x-1 text-xs"
            >
                <FolderIcon className="w-4 h-4 text-prime" strokeWidth={1.5} />
                <span>{entity.folderName}</span>
            </p>
        </div>
    )
}
