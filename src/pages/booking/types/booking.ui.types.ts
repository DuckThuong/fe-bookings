export type UserInfo = {
  userName: string;
  notifCount: number;
  phone: string;
};

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export type PointOption = {
  value: string;
  label: string;
};

export type PassengerInfo = {
  fullName: string;
  phone: string;
  pickupPointDefault: string;
  dropoffPointDefault: string;
  pickupPointOptions: PointOption[];
  dropoffPointOptions: PointOption[];
};

export type TripInfo = {
  from: string;
  to: string;
  operatorName: string;
  operatorCode: string;
  departTime: string;
  arriveTime: string;
  arriveNote?: string;
  date: string;
  durationLabel: string;
  unitPrice: number;
};

export type SeatStatus = "available" | "booked" | "vip";

export type SeatDef = {
  id: string;
  status: SeatStatus;
};

export type SelectedSeat = {
  id: string;
  label: string;
};

export type RowDef = {
  row: number;
  seats: (SeatDef | null)[];
};

export type AddonService = {
  id: string;
  icon: string;
  name: string;
  desc: string;
  price: number;
  hasQty: boolean;
};

export type ConfirmedAddon = {
  id: string;
  icon: string;
  name: string;
  price: number;
};

export type PromoCode = {
  code: string;
  icon: string;
  discount: string;
  desc: string;
  type: "fixed" | "percent";
  value: number;
  max?: number;
};

export type PaymentMethod = {
  id: string;
  icon: string;
  iconColor?: string;
  iconBg?: string;
  name: string;
  desc: string;
};

export type PaymentMethodInfo = {
  label: string;
  last4: string;
};

export type PolicyItem = {
  icon: string;
  title: string;
  tagLabel: string;
  tagVariant: string;
  desc: string;
};

export type OperatorAmenity = {
  icon: string;
  label: string;
};

export type VehicleType = "16" | "24" | "32" | "40" | "45";

export type VehicleConfig = {
  label: string;
  icon: string;
  mapTitle: string;
  mapSub: string;
  floors: number;
  isSleeper: boolean;
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

export type BookingPageData = {
  user: UserInfo;
  breadcrumb: BreadcrumbItem[];
  trip: TripInfo;
  passenger: PassengerInfo;
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

export type BookingSuccessTripInfo = {
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
  paymentMethod: PaymentMethodInfo;
};

export type BookingSuccessData = BookingConfirmData & {
  trip: BookingSuccessTripInfo;
  notifications: NotifItem[];
  nextActions: NextAction[];
};

export type StepItem = {
  label: string;
};
