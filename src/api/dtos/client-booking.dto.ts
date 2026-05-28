export type ClientVehicleTypeDto = "16" | "36" | "45";
export type ClientSeatStatusDto = "available" | "booked" | "vip";
export type ClientPaymentMethodIdDto = "card" | "ewallet" | "bank" | "cash";

export interface TripContextQueryDto {
  tripId: string;
}

export interface SeatMapQueryDto {
  tripId: string;
  vehicleType: ClientVehicleTypeDto;
  floor?: number;
}

export interface ValidatePromoDto {
  tripId: string;
  promoCode: string;
  subTotal: number;
  addonsTotal: number;
}

export interface PassengerDto {
  fullName: string;
  phone: string;
  pickupPoint: string;
  dropoffPoint: string;
}

export interface AddonLineDto {
  id: string;
  name: string;
  price: number;
  qty?: number;
}

export interface CreateHoldDto {
  tripId: string;
  vehicleType: ClientVehicleTypeDto;
  floor?: number;
  seatIds: string[];
  addons?: AddonLineDto[];
  promoCode?: string;
  passenger?: PassengerDto;
  customerId?: string;
  holdSeconds?: number;
}

export interface ConfirmPaymentDto {
  paymentMethodId: ClientPaymentMethodIdDto | string;
  transactionRef?: string;
}

export interface ClientBookingMetaDto {
  version: string;
  currency: string;
  locale: string;
  holdSecondsDefault: number;
  maxSeatsPerBooking: number;
  feeRate: number;
  pickupAddonUnitPrice: number;
}

export interface ClientBookingFlowDto {
  step: number;
  code: string;
  path: string;
  name: string;
}

export interface ClientCatalogVehicleDto {
  type: ClientVehicleTypeDto | string;
  label: string;
  floors: number;
  isSleeper: boolean;
  maxSeatsPerBooking: number;
}

export interface ClientCatalogAddonDto {
  id: string;
  name: string;
  price: number;
  hasQty: boolean;
  qtyMin?: number;
  qtyMax?: number;
}

export interface ClientCatalogPromoDto {
  code: string;
  type: "fixed" | "percent";
  value: number;
  minOrder?: number;
  max?: number;
}

export interface ClientCatalogPointDto {
  value: string;
  label: string;
  city: string;
}

export interface ClientCatalogPaymentMethodDto {
  id: ClientPaymentMethodIdDto | string;
  name: string;
}

export interface ClientBookingCatalogDto {
  vehicles: ClientCatalogVehicleDto[];
  addonServices: ClientCatalogAddonDto[];
  promoCodes: ClientCatalogPromoDto[];
  paymentMethods: ClientCatalogPaymentMethodDto[];
  pickupPoints: ClientCatalogPointDto[];
  dropoffPoints: ClientCatalogPointDto[];
}

export interface ClientBookingConfigResponseDto {
  meta: ClientBookingMetaDto;
  flow: ClientBookingFlowDto[];
  enums: {
    seatStatus: ClientSeatStatusDto[];
    vehicleType: ClientVehicleTypeDto[];
    promoType: Array<"fixed" | "percent">;
    paymentMethodId: string[];
    notifColor: Array<"green" | "amber" | "blue">;
  };
  catalog: ClientBookingCatalogDto;
}

export interface ClientBookingTripDto {
  tripId: string;
  from: string;
  to: string;
  operatorCode: string;
  operatorName: string;
  departTime: string;
  arriveTime: string;
  arriveNote?: string;
  date: string;
  durationLabel: string;
  unitPrice: number | string;
  companyTripId: number;
  companyId: number;
  tripDbId: number;
}

export interface TripContextResponseDto {
  user: {
    userName: string;
    phone: string;
    notifCount: number;
  };
  trip: ClientBookingTripDto;
  passengerDefaults: PassengerDto;
  catalog: ClientBookingCatalogDto;
}

export interface SeatMapSeatDto {
  id: string;
  label: string;
  status: ClientSeatStatusDto;
}

export interface SeatMapRowDto {
  row: number;
  full?: boolean;
  seats: Array<SeatMapSeatDto | null>;
}

export interface SeatMapResponseDto {
  tripId: string;
  vehicleType: ClientVehicleTypeDto;
  floor: number;
  rows: SeatMapRowDto[];
}

export interface ClientPricingResultDto {
  subTotal: number;
  addonsTotal: number;
  fee: number;
  promoCode: string | null;
  promoDiscount: number;
  total: number;
}

export interface ValidatePromoResponseDto {
  valid: boolean;
  promoDiscount: number;
  message?: string;
}

export interface BookingDraftResponseDto {
  holdId: string;
  tripId: string;
  vehicleType: ClientVehicleTypeDto;
  floor: number;
  seatIds: string[];
  addons: AddonLineDto[];
  promoCode: string | null;
  passenger: PassengerDto | null;
  pricing: ClientPricingResultDto;
  holdSeconds: number;
}

export interface CreateHoldResponseDto {
  holdId: string;
  holdSeconds: number;
  expiresAt: string;
  pricing: ClientPricingResultDto;
  bookingDraft: BookingDraftResponseDto;
}

export interface BookingResultSeatDto {
  id: string;
  label: string;
  status: ClientSeatStatusDto | "selected";
}

export interface BookingResultNotificationDto {
  id: string;
  title: string;
  desc: string;
  color: "green" | "amber" | "blue";
}

export interface BookingResultResponseDto {
  bookingId: string;
  status: string;
  holdId: string;
  trip: ClientBookingTripDto;
  passenger: PassengerDto | null;
  seats: BookingResultSeatDto[];
  addons: AddonLineDto[];
  pricing: ClientPricingResultDto;
  payment: {
    methodId: string;
    label: string;
    last4?: string;
  };
  ticket: {
    operatorShortName: string;
    busType: string;
    rating: number;
    hasInsurance: boolean;
    departStation: string;
    arriveStation: string;
    stopsLabel: string;
    boardAt: string;
    alightAt: string;
    qrCode: string;
  };
  notifications: BookingResultNotificationDto[];
}
