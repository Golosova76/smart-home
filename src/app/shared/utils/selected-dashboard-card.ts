import type {
  Card,
  DataModel,
  DeviceItem,
  Item,
  LayoutType,
  Tab,
} from "@/app/shared/models/data.model";
import { ITEM_TYPES } from "@/app/shared/models/data.model";
import { normalizeToKebabCase } from "@/app/shared/utils/selected-dashboard";
import { MAX_LENGTH } from "@/app/shared/utils/constants";
import { isNullOrEmpty } from "@/app/shared/utils/is-null-or-empty";

function validateCardTitle(
  title: string,
  existingCards: Card[],
  excludeId?: string,
): string | null {
  const trimmed: string = title.trim();
  if (!trimmed) return "The name cannot be empty";
  if (trimmed.length > MAX_LENGTH)
    return "The name is too long (maximum 50 characters)";

  const id: string = normalizeToKebabCase(trimmed);
  const exists: boolean = existingCards.some(
    (card: Card): boolean =>
      card.id === id && (isNullOrEmpty(excludeId) || card.id !== excludeId),
  );
  if (exists) return `The card with the name "${trimmed}" already exists`;

  return null;
}

export function mutateAddCard(
  draft: DataModel,
  parameters: { tabId: string; layout: LayoutType; title: string },
): string | null {
  const { tabId, layout, title } = parameters;

  const tab: Tab | undefined = draft.tabs?.find(
    (tab: Tab): boolean => tab.id === tabId,
  );
  if (!tab) return "The tab was not found";

  const cards: Card[] = tab.cards ?? (tab.cards = []);

  const validationError: string | null = validateCardTitle(title, cards);
  if (!isNullOrEmpty(validationError)) return validationError;

  const clean: string = title.trim();
  const id: string = normalizeToKebabCase(clean);

  const newCard: Card = {
    id,
    title: clean,
    layout,
    items: [],
  };

  cards.push(newCard);
  return null;
}

export function mutateCommitCardTitleEdit(
  draft: DataModel,
  parameters: { tabId: string; cardId: string; newTitle: string },
): string | null {
  const tab: Tab | undefined = draft.tabs?.find(
    (tab: Tab): boolean => tab.id === parameters.tabId,
  );
  if (!tab) return "The tab was not found";

  const cards: Card[] = tab.cards ?? [];
  const index: number = cards.findIndex(
    (card: Card): boolean => card.id === parameters.cardId,
  );
  if (index === -1) return "The card was not found";

  const validationError: string | null = validateCardTitle(
    parameters.newTitle,
    cards,
    cards[index].id,
  );
  if (!isNullOrEmpty(validationError)) return validationError;

  const nextTitle: string = parameters.newTitle.trim();
  const nextId: string = normalizeToKebabCase(nextTitle);

  cards[index] = {
    ...cards[index],
    id: nextId,
    title: nextTitle,
  };

  return null;
}

export function mutateRemoveCard(
  draft: DataModel,
  parameters: { tabId: string; cardId: string },
): string | null {
  const tab: Tab | undefined = draft.tabs?.find(
    (tab: Tab): boolean => tab.id === parameters.tabId,
  );
  if (!tab) return "The tab was not found";

  const index: number = (tab.cards ?? []).findIndex(
    (card: Card): boolean => card.id === parameters.cardId,
  );
  if (index === -1) return "The card was not found";

  tab.cards.splice(index, 1);
  return null;
}

export function mutateReorderCard(
  draft: DataModel,
  parameters: { tabId: string; cardId: string; newIndex: number },
): string | null {
  const tab: Tab | undefined = draft.tabs?.find(
    (tab: Tab): boolean => tab.id === parameters.tabId,
  );
  if (!tab) return "The tab was not found";

  const cards: Card[] = tab.cards ?? [];
  const from: number = cards.findIndex(
    (card: Card): boolean => card.id === parameters.cardId,
  );
  if (from === -1) return "The card was not found";

  const to: number = Math.max(
    0,
    Math.min(parameters.newIndex, cards.length - 1),
  );
  if (from === to) return null;

  const [moved] = cards.splice(from, 1);
  cards.splice(to, 0, moved);
  return null;
}

export function setDeviceStateById(
  workingCopy: DataModel,
  deviceId: string,
  nextState: boolean,
): DataModel {
  const copy: DataModel = structuredClone(workingCopy);

  for (const tab of copy.tabs ?? []) {
    for (const card of tab.cards ?? []) {
      const item: DeviceItem | undefined = (card.items ?? []).find(
        (item: Item): item is DeviceItem =>
          item?.type === ITEM_TYPES.DEVICE && item?.id === deviceId,
      );

      if (item) {
        item.state = nextState;
        return copy;
      }
    }
  }

  return workingCopy;
}
