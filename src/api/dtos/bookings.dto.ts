import type {
  AddonService,
  Policy,
  PromoCode,
} from "@/common/constants/booking";
import type {
  BookingPageData,
  RowDef,
  VehicleConfig,
  VehicleType,
} from "@/common/types/booking";

export interface SeatSelectionQuery {
  vehicleType?: VehicleType;
  floor?: number;
  date?: string;
}

export interface SeatSelectionOperator {
  code: string;
  name: string;
  rating: number;
  reviewCount: string;
  routeLabel: string;
  amenities: { icon: string; label: string }[];
}

export interface SeatSelectionVehicle extends VehicleConfig {
  layouts: Record<string, RowDef[]>;
}

export interface ValidatePromoPayload {
  promoCode: string;
  subTotal: number;
  addonsTotal: number;
  tripId?: string;
}

export interface ValidatePromoResponse {
  valid: boolean;
  promoCode: string;
  promoDiscount: number;
  type?: "fixed" | "percent";
  value?: number;
  message?: string;
}

export interface CreateHoldAddonLine {
  id: string;
  name: string;
  price: number;
  qty?: number;
}

export interface CreateHoldPayload {
  tripId: string;
  vehicleType: VehicleType;
  floor?: number;
  seatIds: string[];
  addons?: CreateHoldAddonLine[];
  promoCode?: string;
  holdDurationSeconds?: number;
}

export interface BookingPricing {
  subTotal: number;
  addonsTotal: number;
  fee: number;
  promoCode?: string | null;
  promoDiscount: number;
  total: number;
}

export interface CreateHoldResponse {
  holdId: string;
  expiresAt: string;
  seatIds: string[];
  holdSeconds: number;
  pricing: BookingPricing;
}

export interface PassengerPayload {
  fullName: string;
  phone: string;
  pickupPoint: string;
  dropoffPoint: string;
}

export interface HoldDraftResponse {
  holdId: string;
  tripId: string;
  vehicleType: string;
  floor: number;
  seatIds: string[];
  promoCode: string | null;
  passenger: PassengerPayload;
  pricing: BookingPricing;
  holdSeconds: number;
}

export interface ConfirmPaymentPayload {
  paymentMethodId: string;
  transactionRef?: string;
}

export interface BookingSuccessTrip {
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
    last4?: string;
  };
}

export interface BookingSuccessSeat {
  id: string;
  label: string;
}

export interface BookingSuccessNotification {
  id: string;
  icon: string;
  colorClass: "green" | "amber" | "blue";
  title: string;
  desc: string;
}

export interface BookingSuccessResponse {
  bookingId: string;
  status: string;
  trip: BookingSuccessTrip;
  seats: BookingSuccessSeat[];
  pricing: BookingPricing;
  notifications: BookingSuccessNotification[];
}

export interface SeatSelectionResponse {
  meta: {
    version: string;
    currency: string;
    holdSecondsDefault: number;
    maxSeatsPerBooking: number;
    feeRate: number;
    pickupAddonUnitPrice: number;
    unitPrice: number;
  };
  pageData: BookingPageData & {
    trip: BookingPageData["trip"] & {
      tripId: string;
      companyTripId: number;
    };
  };
  operator: SeatSelectionOperator;
  catalog: {
    addonServices: AddonService[];
    promoCodes: PromoCode[];
    policies: Policy[];
  };
  vehicles: Record<VehicleType, SeatSelectionVehicle>;
  defaultVehicleType: VehicleType;
  defaultFloor: number;
}
