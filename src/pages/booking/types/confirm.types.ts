import type { BookingPageData } from "@/common/types/booking";

export type SelectedSeat = {
  id: string;
  label: string;
};

export type ConfirmedAddon = {
  id: string;
  icon: string;
  name: string;
  price: number;
};

export type PaymentMethod = {
  id: string;
  icon: string;
  iconColor?: string;
  iconBg?: string;
  name: string;
  desc: string;
};

export type BookingConfirmData = {
  pageData: BookingPageData;
  seats: SelectedSeat[];
  addons: ConfirmedAddon[];
  subTotal: number;
  addonsTotal: number;
  fee: number;
  promoCode: string | null;
  promoDiscount: number;
  total: number;
  holdSeconds?: number;
};
