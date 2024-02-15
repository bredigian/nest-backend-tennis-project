export interface Preference {
  items: Item[];
}

export interface Item {
  id: string;
  title: string;
  description: string;
  picture_url: string;
  category_id: string;
  quantity: number;
  currency_id: "ARS";
  unit_price: number;
}

export interface GeneratedPaymentLink {
  id: string;
  init_point: string;
  date_created: Date;
}
