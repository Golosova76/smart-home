export type Device = Omit<DeviceItem, 'type'>;

export type Sensor = Omit<SensorItem, 'type'>;

export interface DeviceItem {
  type: 'device';
  icon: string;
  label: string;
  state: boolean;
}

export interface SensorItem {
  type: 'sensor';
  icon: string;
  label: string;
  value: { amount: number; unit: string };
}

export type Item = DeviceItem | SensorItem;

export type LayoutType = 'horizontalLayout' | 'singleDevice' | 'verticalLayout';

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
