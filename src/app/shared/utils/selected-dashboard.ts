import { DataModel, Tab } from '@/app/shared/models/data.model';

export function normalizeToKebabCase(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replaceAll(/[^\p{L}\p{N}]+/gu, '-')
    .replaceAll(/^-+|-+$/g, '');
}

function validateTabTitle(
  title: string,
  existingTabs: Tab[],
  excludeId?: string,
): string | null {
  const trimmed = title.trim();
  if (!trimmed) return 'The name cannot be empty';
  if (trimmed.length > 50)
    return 'The name is too long (maximum 50 characters)';

  const id = normalizeToKebabCase(trimmed);
  const exists = existingTabs.some(
    (tab) => tab.id === id && (!excludeId || tab.id !== excludeId),
  );
  if (exists) return `The tab with the name "${trimmed}" already exists`;

  return null;
}

export function produceWorkingCopy(
  workingCopy: DataModel | null,
  mutator: (draft: DataModel) => string | null,
): { next: DataModel | null; error: string | null } {
  if (!workingCopy) return { next: workingCopy, error: null };

  const draft = structuredClone(workingCopy) as DataModel;
  const error = mutator(draft);
  if (error) {
    return { next: workingCopy, error };
  }
  return { next: draft, error: null };
}

export function mutateCommitTitleEdit(
  draft: DataModel,
  parameters: { tabId: string; newTitle: string },
): string | null {
  const tabs = draft.tabs ?? [];
  const index = tabs.findIndex((tab) => tab.id === parameters.tabId);
  if (index === -1) return 'The tab was not found';

  const validationError = validateTabTitle(
    parameters.newTitle,
    tabs,
    tabs[index].id,
  );
  if (validationError) return validationError;

  const nextTitle = parameters.newTitle.trim();
  const nextId = normalizeToKebabCase(nextTitle);

  tabs[index] = {
    ...tabs[index],
    id: nextId,
    title: nextTitle,
  };

  return null;
}

export function mutateReorderTab(
  draft: DataModel,
  parameters: { tabId: string; direction: 'left' | 'right' },
): string | null {
  const tabs = draft.tabs ?? [];
  const index = tabs.findIndex((tab) => tab.id === parameters.tabId);
  if (index === -1) return 'The tab was not found';

  const index_ = parameters.direction === 'left' ? index - 1 : index + 1;
  if (index_ < 0 || index_ >= tabs.length) return null; // край — просто ничего не делаем

  [tabs[index], tabs[index_]] = [tabs[index_], tabs[index]];
  return null;
}

export function mutateAddTab(
  draft: DataModel,
  parameters: { title: string },
): string | null {
  const tabs = draft.tabs ?? (draft.tabs = []);

  const validationError = validateTabTitle(parameters.title, tabs);
  if (validationError) return validationError;

  const title = parameters.title.trim();
  const id = normalizeToKebabCase(title);

  tabs.push({ id, title, cards: [] });
  return null;
}

export function mutateRemoveTab(
  draft: DataModel,
  parameters: { tabId: string },
): string | null {
  const tabs = draft.tabs ?? [];
  const index = tabs.findIndex((tab) => tab.id === parameters.tabId);
  if (index === -1) return 'The tab was not found';

  tabs.splice(index, 1);
  return null;
}
