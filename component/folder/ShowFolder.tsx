"use client";

import { File, Folder } from "@/db/db";
import { useCallback, useEffect, useState } from "react";

import DynamicInput from "./EntityCreatingInput";
import EntityRenderer from "./RenderEntity";
import { ContextMenu, EntityCreationStateProps } from "@/types/types";
import ContextMenuComponent from "./ContextMenu";
import EntityCreatingInput from "./EntityCreatingInput";

interface ShowFolderProps {
  entityCreationsState: EntityCreationStateProps|null;
  setEntityCreationsState: (value: EntityCreationStateProps) => void;
  handleSearchTextChange: (value: string) => void;
  data: any[];
};
export default function ShowFolder({ props }: { props: ShowFolderProps }) {
  const { entityCreationsState, setEntityCreationsState, handleSearchTextChange, data } = props;
  const [note] = useState(""); // still state but not tied to keystrokes
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

  const handleOnMenuContext = (e: React.MouseEvent<HTMLDivElement>, entity: any) => {
    e.preventDefault();
    setContextMenu({ entity, x: e.clientX, y: e.clientY, visible: true });
    setEntityCreationsState({
      ...entityCreationsState!,
      entity: entity,
      contextMenu: { entity, x: e.clientX, y: e.clientY, visible: true }
    });
  };

  // Close menu on global click
  useEffect(() => {
    const handleClickOutside = () =>
      setContextMenu((c) =>
        c
          ? { ...c, visible: false }
          : null
      );
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);


  return (
    <>
      {/* this is the create entity input while no parentId(first layer entity) */}
      {entityCreationsState?.entityCreationMethod === "BUTTON" && (
        <div className="mb-5">
          <EntityCreatingInput
            props={{
              entityCreationsState,
              entity: { parentId: null, type: entityCreationsState.entityCreationType },
            }}
          />
        </div>
      )}
      {/* This is the list of entities */}
      <ul>
        {data?.length > 0 ? (
          data.map((entity: (Folder | File)) => (
            <EntityRenderer
              key={entity.id}
              props={{
                entity,
                entityCreationsState,
                setEntityCreationsState,
                handleOnMenuContext
              }}
            />
          ))
        ) : (
          <p className="text-xs text-gray-500">No files or folders yet</p>
        )}
      </ul>
      {/* This is right click menu */}
      {contextMenu?.visible && (
        <ContextMenuComponent
          entityCreationsState={entityCreationsState}
          setEntityCreationsState={setEntityCreationsState}
        />
      )}
    </>
  );
}
