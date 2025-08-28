import { File, Folder } from "@/db/db";

export type FolderAndChild = Folder & {
  children: (FolderAndChild & FileAndChild)[];
};
export type FileAndChild = File & {
  children: (FolderAndChild & FileAndChild)[];
};

export type Entity = FolderAndChild | FileAndChild;
export type EntityCreationMethod = "BUTTON" | "RIGHTCLICK" | "INITIAL_CREATION";
export type EntityCreationType = "FILE" | "FOLDER";
export type RightMenuClick =
  | "CREATE"
  | "FOLDER"
  | "FILE"
  | "DELETE"
  | "RENAME"
  | "SHARE"
  | "OPEN"
  | "DOWNLOAD"
  | "SETTINGS"
  | "PROPERTIES";
export type ContextMenu = {
  entity: any;
  x: number;
  y: number;
  visible: boolean;
};
export type EntityCreationStateProps = {
  entityName?: string;
  entityCreationMethod: EntityCreationMethod | null;
  entity?: any;
  entityCreationType: EntityCreationType | null;
  rightMenuClick?: RightMenuClick | null;
    contextMenu?: ContextMenu;
  setContextMenu?: (value: ContextMenu) => void;
};
