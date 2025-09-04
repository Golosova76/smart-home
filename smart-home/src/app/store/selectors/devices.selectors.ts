import {availableItemsFeature} from '@/app/store/reducers/devices.reducer';
import {createSelector} from '@ngrx/store';
import {
  Device,
  DeviceItem,
  Item,
  ITEM_TYPES,
  Sensor,
  SensorItem,
} from '@/app/shared/models/data.model';

export const selectAvailableItemsState = availableItemsFeature.selectAvailableItemsState;
export const selectItems  = availableItemsFeature.selectItems;
export const selectLoading = availableItemsFeature.selectLoading;
export const selectError   = availableItemsFeature.selectError;

export const selectDevicesNoType = createSelector(
  selectItems,
  (items): Device[] =>
    items
      .filter((item): item is DeviceItem => item.type === ITEM_TYPES.DEVICE)
      .map(({ type, ...rest }) => rest)
);

export const selectSensorsNoType = createSelector(
  selectItems,
  (items): Sensor[] =>
    items
      .filter((item): item is SensorItem => item.type === ITEM_TYPES.SENSOR)
      .map(({ type, ...rest }) => rest)
);

export const selectItemById = (id: string | null) =>
  createSelector(selectItems, (items): Item | null =>
    id ? items.find(item => item.id === id) ?? null : null
  );
