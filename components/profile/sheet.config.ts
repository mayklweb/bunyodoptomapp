import AddressesSheet from './sheets/AddressesSheet';
import OrdersSheet from './sheets/OrdersSheet';
import StoreSheet from './sheets/StoreSheet';
import FavoritesSheet from './sheets/FavoritesSheet';
import ProfilContent from './sheets/ProfilContent';

export type SheetKey =
  | 'profil'
  | 'manzillar'
  | 'buyurtmalar'
  | 'sevimlilar'
  | 'dokon'
  | 'haqimizda'
  | 'boglanish'
  | null;

export const SHEET_TITLES = {
  profil: "Shaxsiy ma'lumotlar",
  manzil: 'Manzil',
  buyurtmalar: 'Buyurtmalar',
  sevimlilar: 'Sevimlilar',
  dokon: "Do'kon",
  haqimizda: 'Biz haqimizda',
  boglanish: "Bog'lanish",
};

export const SHEET_CONTENT = {
  profil: ProfilContent,
  AddressesSheet: AddressesSheet,
  orders: OrdersSheet,
  favorites: FavoritesSheet,
  store: StoreSheet,

  // haqimizda: HaqimizaContent,
  // boglanish: BoglanishContent,
};
