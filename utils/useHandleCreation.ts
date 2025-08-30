import { EntityCreationStateProps } from "@/types/types";

// ✅ update create entity type
export const handleEntityCreationState = (
    entityCreationProps: EntityCreationStateProps,
    set
  clearEntityCreationState?: boolean
) => {
  if (clearEntityCreationState) {
    entityCreationProps.(null);
  } else {
    setEntityCreationsState({ ...entityCreationProps });
  }
};
