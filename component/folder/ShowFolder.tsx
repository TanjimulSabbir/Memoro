"use client";

import { File, Folder } from "@/db/db";
import { useCallback, useEffect, useState } from "react";

import DynamicInput from "./EntityCreatingInput";
import EntityRenderer from "./RenderEntity";

// export type ChildEntity = (Folder | File) & { children: ChildEntity[] };

export type handleCreateEntityType = {
  name: string;
  parentId: string | null;
  type: "FOLDER" | "FILE";
  entityCreationMethod: entityCreationMethod
  rightClickType: RightMenuClickType | null
}
export default function ShowFolder({
  createEntityType,
  handleCreateEntityTypeChange,
  data
}: {
  createEntityType: CreateEntityType;
  handleCreateEntityTypeChange: (createEntityType: CreateEntityType) => void;
  data: (Folder | File)[];
}) {
  const [note] = useState(""); // still state but not tied to keystrokes
  const [contextMenu, setContextMenu] = useState<ContextMenu>({ entity: null, x: 0, y: 0, visible: false });

  const handleCreateEntity = useCallback(

    [note, handleCreateEntityTypeChange]
  );

  const handleOnMenuContext = (e: React.MouseEvent<HTMLDivElement>, entity: Folder | File,) => {
    e.preventDefault();
    setContextMenu({ entity, x: e.clientX, y: e.clientY, visible: true });
  };



  // Close menu on global click
  useEffect(() => {
    const handleClickOutside = () => setContextMenu((c) => ({ ...c, visible: false }));
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);


  return (
    <>
      {/* this is the create entity input while no parentId(first layer entity) */}
      {createEntityType.createBy === "BUTTON" && (
        <div className="mb-5">
          <DynamicInput
            entity={null}
            createEntityType={createEntityType}
            onSubmit={(val) => handleCreateEntity({ name: val, parentId: null, type: createEntityType.type, entityCreationMethod: createEntityType.createBy, rightClickType: null })}
            onCancel={(type) => handleCreateEntityTypeChange({ createBy: null, type, parentId: null, rightClickType: null })}
          />
        </div>
      )}
      {/* This is the list of entities */}
      <ul>
        {data?.length > 0 ? (
          data.map((entity: (Folder | File)) => (
            <EntityRenderer
              key={entity.id}
              entity={entity}
              createEntityType={createEntityType}
              handleCreateEntityTypeChange={handleCreateEntityTypeChange}
              handleCreateEntity={handleCreateEntity}
              handleOnMenuContext={handleOnMenuContext}
            />
          ))
        ) : (
          <p className="text-xs text-gray-500">No files or folders yet</p>
        )}
      </ul>
      {/* This is right click menu */}
      {contextMenu.visible && (
        <ContextMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          handleCreateEntityTypeChange={handleCreateEntityTypeChange}
        />
      )}
    </>
  );
}
