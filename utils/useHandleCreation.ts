import { EntityCreationStateProps } from "@/types/types";

// ✅ update create entity type
export const handleEntityCreationState = (
    entityCreationProps: EntityCreationStateProps,
    set: (value: EntityCreationStateProps | null) => void,
    clearEntityCreationState?: boolean
) => {
  if (clearEntityCreationState) {
    set(null);
  } else {
    set({ ...entityCreationProps });
  }
};
