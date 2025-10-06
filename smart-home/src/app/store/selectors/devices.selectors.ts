import { availableItemsFeature } from '@/app/store/reducers/devices.reducer';
import { createSelector } from '@ngrx/store';
import {
  DeviceItem,
  Item,
  ITEM_TYPES,
  SensorItem,
} from '@/app/shared/models/data.model';

export const selectAvailableItemsState =
  availableItemsFeature.selectAvailableItemsState;
export const selectItems = availableItemsFeature.selectItems;
export const selectLoading = availableItemsFeature.selectLoading;
export const selectError = availableItemsFeature.selectError;
export const selectLoaded = availableItemsFeature.selectLoaded;

export const selectDevices = createSelector(
  selectItems,
  (items): DeviceItem[] =>
    items.filter((item): item is DeviceItem => item.type === ITEM_TYPES.DEVICE),
);

export const selectSensors = createSelector(
  selectItems,
  (items): SensorItem[] =>
    items.filter((item): item is SensorItem => item.type === ITEM_TYPES.SENSOR),
);

export const selectItemById = (id: string | null) =>
  createSelector(selectItems, (items): Item | null =>
    id ? (items.find((item) => item.id === id) ?? null) : null,
  );

export const selectDeviceById = (id: string) =>
  createSelector(selectDevices, (devices) => devices.find((d) => d.id === id)!);

export const selectSensorById = (id: string) =>
  createSelector(selectSensors, (sensors) => sensors.find((s) => s.id === id)!);
