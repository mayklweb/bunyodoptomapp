export type CartRowItem = {
  id: string | number;
  name: string;
  price: number;
  count: number;
  images?: {
    url: string;
  }[];
};