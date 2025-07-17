export interface Card {
  id: string;
  items: Item[];
  layout: LayoutType;
  title: string;
}

export interface DataModel {
  tabs: Tab[];
}

export interface DeviceItem {
  icon: string;
  label: string;
  state: boolean;
  type: string;
}

export type Item = DeviceItem | SensorItem;

export type LayoutType = "horizontalLayout' | 'verticalLayout' | 'singleDevice";

export interface SensorItem {
  icon: string;
  label: string;
  type: string;
  value: { amount: number; unit: string };
}

export interface Tab {
  cards: Card[];
  id: string;
  title: string;
}
