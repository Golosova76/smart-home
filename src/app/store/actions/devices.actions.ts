import { createActionGroup, emptyProps, props } from "@ngrx/store";
import type { Item } from "@/app/shared/models/data.model";

export const AvailableItemsActions = createActionGroup({
  source: "AvailableItems",
  events: {
    Load: emptyProps(),
    LoadSuccess: props<{ devices: Item[] }>(),
    LoadFailure: props<{ error: string }>(),
    "Update Card Items": props<{
      tabId: string;
      cardId: string;
      items: Item[];
    }>(),
  },
});
