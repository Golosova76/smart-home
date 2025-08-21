export type Device = Omit<DeviceItem, 'type'>;

export type Sensor = Omit<SensorItem, 'type'>;

export interface DeviceItem {
  type: typeof ITEM_TYPES.DEVICE;
  icon: string;
  label: string;
  state: boolean;
}

export interface SensorItem {
  type: typeof ITEM_TYPES.SENSOR;
  icon: string;
  label: string;
  value: { amount: number; unit: string };
}

export type Item = DeviceItem | SensorItem;

export const ITEM_TYPES = {
  DEVICE: 'device',
  SENSOR: 'sensor'
} as const;

export type ItemType = typeof ITEM_TYPES[keyof typeof ITEM_TYPES];

export const LAYOUT_TYPES = {
  HORIZONTAL: 'horizontalLayout',
  SINGLE_DEVICE: 'singleDevice',
  VERTICAL: 'verticalLayout'
} as const;

export type LayoutType = typeof LAYOUT_TYPES[keyof typeof LAYOUT_TYPES];

export interface Card {
  id: string;
  title: string;
  layout: LayoutType;
  items: Item[];
}

export interface Tab {
  id: string;
  title: string;
  cards: Card[];
}

export interface DataModel {
  tabs: Tab[];
}
