
export type LayoutType = 'horizontalLayout\' | \'verticalLayout\' | \'singleDevice';

export type Item = SensorItem | DeviceItem;

export interface DeviceItem {
  type: string;
  icon: string;
  label: string;
  state: boolean;
}

export interface SensorItem {
  type: string;
  icon: string;
  label: string;
  value: { amount: number; unit: string };
}

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





