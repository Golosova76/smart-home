import type { DataModel, Tab } from "@/app/shared/models/data.model";
import { MAX_LENGTH } from "@/app/shared/utils/constants";
import {
  isNonEmptyString,
  isNullOrEmpty,
} from "@/app/shared/utils/is-null-or-empty";

export function normalizeToKebabCase(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replaceAll(/[^\p{L}\p{N}]+/gu, "-")
    .replaceAll(/^-+|-+$/g, "");
}

function validateTabTitle(
  title: string,
  existingTabs: Tab[],
  excludeId?: string,
): string | null {
  // сузили к строке и нормализовали
  const trimmed: string = isNonEmptyString(title) ? title.trim() : "";

  if (isNullOrEmpty(trimmed)) {
    return "The name cannot be empty";
  }
  if (trimmed.length > MAX_LENGTH) {
    return "The name is too long (maximum 50 characters)";
  }

  const id: string = normalizeToKebabCase(trimmed);
  const exists: boolean = existingTabs.some(
    (tab: Tab): boolean =>
      tab.id === id && (isNullOrEmpty(excludeId) || tab.id !== excludeId),
  );
  if (exists) return `The tab with the name "${trimmed}" already exists`;

  return null;
}

export function produceWorkingCopy(
  workingCopy: DataModel | null,
  mutator: (draft: DataModel) => string | null,
): { next: DataModel | null; error: string | null } {
  if (workingCopy === null) {
    return { next: workingCopy, error: null };
  }

  const draft: DataModel = structuredClone(workingCopy);
  const error: string | null = mutator(draft);
  if (!isNullOrEmpty(error)) {
    return { next: workingCopy, error };
  }
  return { next: draft, error: null };
}

export function mutateCommitTitleEdit(
  draft: DataModel,
  parameters: { tabId: string; newTitle: string },
): string | null {
  const tabs: Tab[] = draft.tabs ?? [];
  const index: number = tabs.findIndex(
    (tab: Tab): boolean => tab.id === parameters.tabId,
  );
  if (index === -1) return "The tab was not found";

  const validationError: string | null = validateTabTitle(
    parameters.newTitle,
    tabs,
    tabs[index].id,
  );
  if (!isNullOrEmpty(validationError)) return validationError;

  const nextTitle: string = parameters.newTitle.trim();
  const nextId: string = normalizeToKebabCase(nextTitle);

  tabs[index] = {
    ...tabs[index],
    id: nextId,
    title: nextTitle,
  };

  return null;
}

export function mutateReorderTab(
  draft: DataModel,
  parameters: { tabId: string; direction: "left" | "right" },
): string | null {
  const tabs: Tab[] = draft.tabs ?? [];
  const index: number = tabs.findIndex(
    (tab: Tab): boolean => tab.id === parameters.tabId,
  );
  if (index === -1) return "The tab was not found";

  const index_: number =
    parameters.direction === "left" ? index - 1 : index + 1;
  if (index_ < 0 || index_ >= tabs.length) return null; // край — просто ничего не делаем

  [tabs[index], tabs[index_]] = [tabs[index_], tabs[index]];
  return null;
}

export function mutateAddTab(
  draft: DataModel,
  parameters: { title: string },
): string | null {
  const tabs: Tab[] = draft.tabs ?? (draft.tabs = []);

  const validationError: string | null = validateTabTitle(
    parameters.title,
    tabs,
  );
  if (!isNullOrEmpty(validationError)) return validationError;

  const title: string = parameters.title.trim();
  const id: string = normalizeToKebabCase(title);

  tabs.push({ id, title, cards: [] });
  return null;
}

export function mutateRemoveTab(
  draft: DataModel,
  parameters: { tabId: string },
): string | null {
  const tabs: Tab[] = draft.tabs ?? [];
  const index: number = tabs.findIndex(
    (tab: Tab): boolean => tab.id === parameters.tabId,
  );
  if (index === -1) return "The tab was not found";

  tabs.splice(index, 1);
  return null;
}
