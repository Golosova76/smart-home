import { Card, DataModel, LayoutType } from '@/app/shared/models/data.model';
import { normalizeToKebabCase } from '@/app/shared/utils/selected-dashboard';

function validateCardTitle(
  title: string,
  existingCards: Card[],
  excludeId?: string,
): string | null {
  const trimmed = title.trim();
  if (!trimmed) return 'The name cannot be empty';
  if (trimmed.length > 50)
    return 'The name is too long (maximum 50 characters)';

  const id = normalizeToKebabCase(trimmed);
  const exists = existingCards.some(
    (card) => card.id === id && (!excludeId || card.id !== excludeId),
  );
  if (exists) return `The card with the name "${trimmed}" already exists`;

  return null;
}

export function mutateAddCard(
  draft: DataModel,
  parameters: { tabId: string; layout: LayoutType; title: string },
): string | null {
  const { tabId, layout, title } = parameters;

  const tab = draft.tabs?.find((tab) => tab.id === tabId);
  if (!tab) return 'The tab was not found';

  const cards = tab.cards ?? (tab.cards = []);

  const validationError = validateCardTitle(title, cards);
  if (validationError) return validationError;

  const clean = title.trim();
  const id = normalizeToKebabCase(clean);

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
  const tab = draft.tabs?.find((tab) => tab.id === parameters.tabId);
  if (!tab) return 'The tab was not found';

  const cards = tab.cards ?? [];
  const index = cards.findIndex((card) => card.id === parameters.cardId);
  if (index === -1) return 'The card was not found';

  const validationError = validateCardTitle(
    parameters.newTitle,
    cards,
    cards[index].id,
  );
  if (validationError) return validationError;

  const nextTitle = parameters.newTitle.trim();
  const nextId = normalizeToKebabCase(nextTitle);

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
  const tab = draft.tabs?.find((tab) => tab.id === parameters.tabId);
  if (!tab) return 'The tab was not found';

  const index = (tab.cards ?? []).findIndex(
    (card) => card.id === parameters.cardId,
  );
  if (index === -1) return 'The card was not found';

  tab.cards!.splice(index, 1);
  return null;
}

export function mutateReorderCard(
  draft: DataModel,
  parameters: { tabId: string; cardId: string; newIndex: number },
): string | null {
  const tab = draft.tabs?.find((tab) => tab.id === parameters.tabId);
  if (!tab) return 'The tab was not found';

  const cards = tab.cards ?? [];
  const from = cards.findIndex((card) => card.id === parameters.cardId);
  if (from === -1) return 'The card was not found';

  const to = Math.max(0, Math.min(parameters.newIndex, cards.length - 1));
  if (from === to) return null;

  const [moved] = cards.splice(from, 1);
  cards.splice(to, 0, moved);
  return null;
}
