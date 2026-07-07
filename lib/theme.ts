export const C = {
  primary: '#0040B1',
  primaryLight: '#EBF0FF',
  primaryDark: '#002E80',
  bg: '#F5F5F5',
  card: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#9090A0',
  border: '#E5E5E5',
  danger: '#FF4757',
};

export const BANNERS = [
  { id: '1', label: 'Chegirma', title: 'Ширинлик\nоптом арзон!', bg: '#0040B1' },
  { id: '2', label: 'Yangi', title: 'Конфет &\nШоколат', bg: '#1B62D4' },
  { id: '3', label: 'Trend', title: 'Печинелар\n& Вафлилар', bg: '#002E80' },
  { id: '4', label: 'Maxsus', title: 'Макарон\n& Кекслар', bg: '#1A4FB5' },
];

export const CATEGORIES = [
  { id: '1', name: 'ПЕЧИНЕ', emoji: '🍪' },
  { id: '2', name: 'КОНФЕТ', emoji: '🍬' },
  { id: '3', name: 'ШОКОЛАТ', emoji: '🍫' },
  { id: '4', name: 'ВАФЛИ', emoji: '🧇' },
  { id: '5', name: 'КЕКС', emoji: '🧁' },
  { id: '6', name: 'ПИШИРИКЛАР', emoji: '🥐' },
  { id: '7', name: 'ШК ПЕЧИНЯ', emoji: '🍮' },
  { id: '8', name: 'МАКАРОН', emoji: '🍭' },
  { id: '9', name: 'СОРАК КАНДЛАР', emoji: '🍯' },
  { id: '10', name: 'НОВВОТ ЧОЙЛАР', emoji: '🍵' },
];

export const BRANDS = [
  { id: '1', name: 'МИЛЛИЙ ШИРИНЛИК', emoji: '🏭' },
  { id: '2', name: 'ФАРЗОД ШИРИНЛИК', emoji: '✨' },
  { id: '3', name: 'ШИРИН АФСОНА', emoji: '🌟' },
  { id: '4', name: 'МУХАЙЙО', emoji: '🎀' },
  { id: '5', name: 'САМАРКАНД', emoji: '🌺' },
  { id: '6', name: 'ДВА ГУСЯ', emoji: '🦢' },
  { id: '7', name: 'ЖАСМИН', emoji: '🌸' },
  { id: '8', name: 'БОЛ КАЙМОК', emoji: '🍯' },
  { id: '9', name: 'АЗИЗА', emoji: '🌹' },
  { id: '10', name: 'НУР МУХАММАД', emoji: '⭐' },
  { id: '11', name: 'ИСТИКЛОЛ', emoji: '🏔️' },
  { id: '12', name: 'ГАНЖА ВАЛИ', emoji: '💫' },
];

export type Product = {
  id: string;
  name: string;
  price: number;
  emoji: string;
  bg: string;
  url?: string;
};

export const PRODUCTS: Product[] = [
  { id: '1', name: 'КИНД МЕВА МАЛИНА 2,5 КГ', price: 31000, emoji: '🍬', bg: '#EBF0FF', url: 'https://api.bunyodoptom.uz/uploads/products/6588/1773829675873_741a0f6a7c6124fc326a758b66f555f8.jpg' },
  { id: '2', name: 'КИНД МЕВА БАНАН 2,5 КГ', price: 31000, emoji: '🍌', bg: '#FFF8EE', url: 'https://api.bunyodoptom.uz/uploads/products/6587/1773829653526_9f202a03dbb6462c6f2ff124445b42f1.jpg' },
  { id: '3', name: 'КИНД МЕВА ПЛОМБИР 2.5 КГ', price: 31000, emoji: '🍦', bg: '#EEF6FF', url: 'https://api.bunyodoptom.uz/uploads/products/6586/1773829715015_4d0dfc8c3351d31bed31bfae16191fba.jpg' },
  { id: '4', name: 'ШОКОЛАД ПРЕМИУМ 1 КГ', price: 45000, emoji: '🍫', bg: '#F0FFF4' },
  { id: '5', name: 'ВАФЛИ АССОРТИ 1 КГ', price: 28000, emoji: '🧇', bg: '#FFF0F5' },
  { id: '6', name: 'ПЕЧЕНЬЕ МИКС 2 КГ', price: 35000, emoji: '🍪', bg: '#FFF8EE' },
  { id: '7', name: 'КОНФЕТ АССОРТИ 1 КГ', price: 22000, emoji: '🍬', bg: '#EBF0FF' },
  { id: '8', name: 'КЕКС ШОКОЛАД 500Г', price: 18000, emoji: '🧁', bg: '#F0FFF4' },
];

export const TRENDING: Product[] = [
  { id: '2', name: 'КИНД МЕВА БАНАН 2,5 КГ', price: 31000, emoji: '🍌', bg: '#FFF8EE', url: 'https://api.bunyodoptom.uz/uploads/products/6587/1773829653526_9f202a03dbb6462c6f2ff124445b42f1.jpg' },
  { id: '1', name: 'КИНД МЕВА МАЛИНА 2,5 КГ', price: 31000, emoji: '🍬', bg: '#EBF0FF', url: 'https://api.bunyodoptom.uz/uploads/products/6588/1773829675873_741a0f6a7c6124fc326a758b66f555f8.jpg' },
  { id: '3', name: 'КИНД МЕВА ПЛОМБИР 2.5 КГ', price: 31000, emoji: '🍦', bg: '#EEF6FF', url: 'https://api.bunyodoptom.uz/uploads/products/6586/1773829715015_4d0dfc8c3351d31bed31bfae16191fba.jpg' },
  { id: '5', name: 'ВАФЛИ АССОРТИ 1 КГ', price: 28000, emoji: '🧇', bg: '#FFF0F5' },
];
