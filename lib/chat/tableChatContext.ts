import { PromptNodeContext } from '@/types/chat';
import { SelectedObject } from '@/signals/tables/selection';

export type ChatContext = {
  input: string;
  selectedObjects: PromptNodeContext[];
};

export const buildTableSelectionContext = (
  clusterID: string,
  userText: string,
  selectedObjects: SelectedObject[]
): ChatContext => {
  const selectedContexts = selectedObjects.map(object => ({
    clusterID,
    id: object.id,
    namesapce: object.namespace || '',
    name: object.name,
    kind: object.kind,
  }));

  return {
    input: userText,
    selectedObjects: selectedContexts,
  };
};
