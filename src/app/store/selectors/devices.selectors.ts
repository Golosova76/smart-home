import { availableItemsFeature } from "@/app/store/reducers/devices.reducer";
import type { MemoizedSelector } from "@ngrx/store";
import { createSelector } from "@ngrx/store";
import type {
  DeviceItem,
  Item,
  SensorItem,
} from "@/app/shared/models/data.model";
import { ITEM_TYPES } from "@/app/shared/models/data.model";

export const selectAvailableItemsState =
  availableItemsFeature.selectAvailableItemsState;
export const selectItems = availableItemsFeature.selectItems;
export const selectLoading = availableItemsFeature.selectLoading;
export const selectError = availableItemsFeature.selectError;
export const selectLoaded = availableItemsFeature.selectLoaded;

export const selectDevices = createSelector(
  selectItems,
  (items: Item[]): DeviceItem[] =>
    items.filter(
      (item: Item): item is DeviceItem => item.type === ITEM_TYPES.DEVICE,
    ),
);

export const selectSensors = createSelector(
  selectItems,
  (items: Item[]): SensorItem[] =>
    items.filter(
      (item: Item): item is SensorItem => item.type === ITEM_TYPES.SENSOR,
    ),
);

export const selectItemById = (
  id: string | null,
): MemoizedSelector<object, Item | null> =>
  createSelector(selectItems, (items: Item[]): Item | null =>
    id !== null && id !== undefined && id !== ""
      ? (items.find((item: Item): boolean => item.id === id) ?? null)
      : null,
  );

export const selectDeviceById = (
  id: string,
): MemoizedSelector<object, DeviceItem | null> =>
  createSelector(
    selectDevices,
    (devices: DeviceItem[]): DeviceItem | null =>
      devices.find((device: DeviceItem): boolean => device.id === id) ?? null,
  );

export const selectSensorById = (
  id: string,
): MemoizedSelector<object, SensorItem | null> =>
  createSelector(
    selectSensors,
    (sensors: SensorItem[]): SensorItem | null =>
      sensors.find((sensor: SensorItem): boolean => sensor.id === id) ?? null,
  );
