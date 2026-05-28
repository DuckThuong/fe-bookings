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
  qty?: number;
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
  holdId?: string;
  tripId?: string;
  vehicleType?: "16" | "36" | "45";
  floor?: number;
  pageData: BookingPageData;
  seats: SelectedSeat[];
  addons: ConfirmedAddon[];
  addonLines?: Array<{
    id: string;
    name: string;
    price: number;
    qty?: number;
  }>;
  subTotal: number;
  addonsTotal: number;
  fee: number;
  promoCode: string | null;
  promoDiscount: number;
  total: number;
  holdSeconds?: number;
  paymentMethodId?: string;
};

export type NotifColorClass = "green" | "amber" | "blue";

export type NotifItem = {
  id: string;
  icon: string;
  colorClass: NotifColorClass;
  title: string;
  desc: string;
};

export type NextAction = {
  id: string;
  icon: string;
  label: string;
  desc: string;
  prompt: string;
};

export type TripInfo = {
  bookingId: string;
  operatorShortName: string;
  operatorName: string;
  busType: string;
  rating: number;
  hasInsurance: boolean;
  departTime: string;
  departCity: string;
  departStation: string;
  arriveTime: string;
  arriveTimeNote?: string;
  arriveCity: string;
  arriveStation: string;
  durationLabel: string;
  stopsLabel: string;
  date: string;
  boardAt: string;
  alightAt: string;
  qrCode: string;
  paymentMethod: {
    label: string;
    last4: string;
  };
};

export type BookingSuccessData = BookingConfirmData & {
  trip: TripInfo;
  notifications: NotifItem[];
  nextActions: NextAction[];
};
