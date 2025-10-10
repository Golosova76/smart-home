export interface Dashboard {
  id: string;
  title: string;
  icon: string;
}

export type EntityDelete = "dashboard" | "tab" | "card";

export type EntityActions = "Add" | "Delete";

export type FooterVariant = "form" | "delete";
