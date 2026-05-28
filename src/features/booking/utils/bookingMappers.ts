import type {
  AddonLineDto,
  BookingDraftResponseDto,
  BookingResultNotificationDto,
  BookingResultResponseDto,
  ClientBookingConfigResponseDto,
  ClientCatalogAddonDto,
  ClientCatalogPaymentMethodDto,
  ClientCatalogPromoDto,
  ClientCatalogVehicleDto,
  ClientPricingResultDto,
  ClientVehicleTypeDto,
  CreateHoldResponseDto,
  PassengerDto,
  SeatMapResponseDto,
  TripContextResponseDto,
} from "@/api/dtos/client-booking.dto";
import type { ClientAccountBookingDto } from "@/api/dtos/client-account.dto";
import type { ClientTripDto } from "@/api/dtos/client-catalog.dto";
import type {
  BookingPageData,
  RowDef,
  VehicleConfig,
  VehicleType,
} from "@/common/types/booking";
import type { AddonService } from "@/common/constants/booking";
import type {
  BookingConfirmData,
  BookingSuccessData,
  ConfirmedAddon,
  NextAction,
  NotifItem,
  PaymentMethod,
} from "@/pages/booking/types/confirm.types";
import type { Trip } from "@/common/types/ticket";

export interface CatalogAddonOption extends AddonService {
  hasQty: boolean;
  qtyMin?: number;
  qtyMax?: number;
}

const vehicleIcons: Record<ClientVehicleTypeDto, string> = {
  "16": "ti-car-suv",
  "36": "ti-bus",
  "45": "ti-bus",
};

const addonIcons: Record<string, string> = {
  insurance: "shield-check",
  meal: "tools-kitchen-2",
  baggage: "luggage",
  pillow: "bed",
  pickup: "map-pin",
};

const paymentIconMeta: Record<
  string,
  Pick<PaymentMethod, "icon" | "iconColor" | "iconBg" | "desc">
> = {
  card: {
    icon: "ti-credit-card",
    iconColor: "#0a0e1a",
    desc: "Visa, Mastercard, JCB",
  },
  ewallet: {
    icon: "ti-wallet",
    iconColor: "#fff",
    iconBg: "#ee4d2d",
    desc: "MoMo, ZaloPay, VNPay",
  },
  bank: {
    icon: "ti-building-bank",
    iconColor: "#1d4ed8",
    desc: "Internet Banking",
  },
  cash: {
    icon: "ti-cash",
    iconColor: "#16a34a",
    desc: "Thanh toan tai quay",
  },
};

const defaultNextActions: NextAction[] = [
  {
    id: "download_ticket",
    icon: "ti-download",
    label: "Tai ve PDF",
    desc: "Luu ve dien tu",
    prompt: "download_ticket",
  },
  {
    id: "share_ticket",
    icon: "ti-share",
    label: "Chia se ve",
    desc: "Gui ve cho nguoi than",
    prompt: "share_ticket",
  },
  {
    id: "go_home",
    icon: "ti-home",
    label: "Ve trang chu",
    desc: "Dat ve chuyen khac",
    prompt: "go_home",
  },
  {
    id: "view_history",
    icon: "ti-history",
    label: "Lich su dat ve",
    desc: "Xem cac ve da dat",
    prompt: "view_history",
  },
];

const API_VEHICLE_TYPE_LABEL: Record<string, string> = {
  SLEEPER: "Xe giuong nam",
  LIMOUSINE: "Xe Limousine",
  COACH: "Xe khach",
};

export const toNumber = (value: number | string | null | undefined) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const isClientVehicleType = (
  value: string | null | undefined,
): value is ClientVehicleTypeDto =>
  value === "16" || value === "36" || value === "45";

export const inferClientVehicleType = (
  rawType?: string | null,
  totalSeat?: number,
): ClientVehicleTypeDto => {
  const normalized = rawType?.trim();

  if (isClientVehicleType(normalized)) {
    return normalized;
  }

  const seatCount = Number(totalSeat ?? 0);
  if (seatCount <= 18) return "16";
  if (seatCount <= 40) return "36";
  return "45";
};

export const mapSeatMapRows = (seatMap?: SeatMapResponseDto): RowDef[] =>
  seatMap?.rows.map((row) => ({
    row: row.row,
    full: row.full,
    seats: row.seats.map((seat) =>
      seat
        ? {
            id: seat.id,
            label: seat.label,
            status: seat.status,
          }
        : null,
    ),
  })) ?? [];

export const mapVehicleConfigs = (
  vehicles?: ClientCatalogVehicleDto[],
): Record<VehicleType, VehicleConfig> => {
  const fallback: Record<VehicleType, VehicleConfig> = {
    "16": {
      label: "Xe 16 cho",
      icon: vehicleIcons["16"],
      mapTitle: "Xe 16 cho",
      mapSub: "Chon ghe con trong.",
      floors: 1,
      isSleeper: false,
    },
    "36": {
      label: "Giuong nam 36",
      icon: vehicleIcons["36"],
      mapTitle: "Giuong nam 36 cho",
      mapSub: "Xe 2 tang, chon tang va ghe con trong.",
      floors: 2,
      isSleeper: true,
    },
    "45": {
      label: "Ghe ngoi 45",
      icon: vehicleIcons["45"],
      mapTitle: "Xe ghe ngoi 45 cho",
      mapSub: "Chon ghe con trong.",
      floors: 1,
      isSleeper: false,
    },
  };

  for (const vehicle of vehicles ?? []) {
    if (!isClientVehicleType(vehicle.type)) continue;

    fallback[vehicle.type] = {
      label: vehicle.label,
      icon: vehicleIcons[vehicle.type],
      mapTitle: vehicle.label,
      mapSub: "Chon ghe con trong. Toi da 4 ghe moi lan dat.",
      floors: vehicle.floors,
      isSleeper: vehicle.isSleeper,
    };
  }

  return fallback;
};

export const mapCatalogAddons = (
  addons?: ClientCatalogAddonDto[],
): CatalogAddonOption[] =>
  (addons ?? []).map((addon) => ({
    id: addon.id,
    icon: addonIcons[addon.id] ?? "sparkles",
    name: addon.name,
    desc: addon.hasQty ? "Dich vu tinh theo so luong" : "Dich vu tuy chon",
    price: toNumber(addon.price),
    hasQty: addon.hasQty,
    qtyMin: addon.qtyMin,
    qtyMax: addon.qtyMax,
  }));

export const mapCatalogPromos = (promos?: ClientCatalogPromoDto[]) =>
  (promos ?? []).map((promo) => ({
    code: promo.code,
    icon: promo.type === "percent" ? "ti-gift" : "ti-ticket",
    discount:
      promo.type === "fixed"
        ? `Giam ${toNumber(promo.value).toLocaleString("vi-VN")}d`
        : `Giam ${Math.round(toNumber(promo.value) * 100)}%`,
    desc: promo.minOrder
      ? `Don tu ${toNumber(promo.minOrder).toLocaleString("vi-VN")}d`
      : promo.max
        ? `Toi da ${toNumber(promo.max).toLocaleString("vi-VN")}d`
        : "Uu dai co san",
    type: promo.type,
    value: toNumber(promo.value),
    max: promo.max,
    minOrder: promo.minOrder,
  }));

export const mapPaymentMethods = (
  methods?: ClientCatalogPaymentMethodDto[],
): PaymentMethod[] =>
  (methods ?? []).map((method) => ({
    id: method.id,
    name: method.name,
    ...(paymentIconMeta[method.id] ?? {
      icon: "ti-credit-card",
      desc: "Phuong thuc thanh toan",
    }),
  }));

export const mapBookingPageData = (
  context: TripContextResponseDto,
): BookingPageData => ({
  user: {
    userName: context.user.userName,
    notifCount: context.user.notifCount,
    phone: context.user.phone ?? "",
  },
  breadcrumb: [
    { label: "Trang chu", href: "/" },
    { label: "Ve xe", href: "/booking" },
    { label: "Chon ghe", href: "/booking" },
  ],
  trip: {
    tripId: context.trip.tripId,
    from: context.trip.from,
    to: context.trip.to,
    operatorCode: context.trip.operatorCode,
    operatorName: context.trip.operatorName,
    departTime: context.trip.departTime,
    arriveTime: context.trip.arriveTime,
    arriveNote: context.trip.arriveNote,
    date: context.trip.date,
    durationLabel: context.trip.durationLabel,
    unitPrice: toNumber(context.trip.unitPrice),
    companyTripId: context.trip.companyTripId,
    companyId: context.trip.companyId,
    tripDbId: context.trip.tripDbId,
  },
  passenger: {
    fullName: context.passengerDefaults.fullName,
    phone: context.passengerDefaults.phone,
    pickupPointDefault: context.passengerDefaults.pickupPoint,
    dropoffPointDefault: context.passengerDefaults.dropoffPoint,
    pickupPointOptions: context.catalog.pickupPoints.map((point) => ({
      value: point.value,
      label: point.label,
    })),
    dropoffPointOptions: context.catalog.dropoffPoints.map((point) => ({
      value: point.value,
      label: point.label,
    })),
  },
});

const mapAddonsForConfirm = (addons?: AddonLineDto[]): ConfirmedAddon[] =>
  (addons ?? []).map((addon) => ({
    id: addon.id,
    icon: addonIcons[addon.id] ?? "sparkles",
    name: addon.name,
    price: toNumber(addon.price) * (addon.qty ?? 1),
    qty: addon.qty,
  }));

const mapPricingToConfirm = (pricing: ClientPricingResultDto) => ({
  subTotal: toNumber(pricing.subTotal),
  addonsTotal: toNumber(pricing.addonsTotal),
  fee: toNumber(pricing.fee),
  promoCode: pricing.promoCode,
  promoDiscount: toNumber(pricing.promoDiscount),
  total: toNumber(pricing.total),
});

export const buildConfirmDataFromHold = (
  context: TripContextResponseDto,
  hold: CreateHoldResponseDto | BookingDraftResponseDto,
): BookingConfirmData => {
  const draft = "bookingDraft" in hold ? hold.bookingDraft : hold;
  const pricing = mapPricingToConfirm(draft.pricing);

  return {
    holdId: draft.holdId,
    tripId: draft.tripId,
    vehicleType: draft.vehicleType,
    floor: draft.floor,
    pageData: mapBookingPageData(context),
    seats: draft.seatIds.map((id) => ({ id, label: id })),
    addons: mapAddonsForConfirm(draft.addons),
    addonLines: draft.addons,
    holdSeconds: draft.holdSeconds,
    ...pricing,
  };
};

export const buildConfirmDataFromResult = (
  result: BookingResultResponseDto,
  config?: ClientBookingConfigResponseDto,
): BookingConfirmData => {
  const passenger: PassengerDto = result.passenger ?? {
    fullName: "",
    phone: "",
    pickupPoint: config?.catalog.pickupPoints[0]?.value ?? "",
    dropoffPoint: config?.catalog.dropoffPoints[0]?.value ?? "",
  };
  const pricing = mapPricingToConfirm(result.pricing);

  return {
    holdId: result.holdId,
    tripId: result.trip.tripId,
    vehicleType: isClientVehicleType(result.ticket.busType)
      ? result.ticket.busType
      : undefined,
    pageData: {
      user: {
        userName: passenger.fullName,
        notifCount: 0,
        phone: passenger.phone,
      },
      breadcrumb: [
        { label: "Trang chu", href: "/" },
        { label: "Ve xe", href: "/booking" },
        { label: "Chon ghe", href: "/booking" },
      ],
      trip: {
        tripId: result.trip.tripId,
        from: result.trip.from,
        to: result.trip.to,
        operatorCode: result.trip.operatorCode,
        operatorName: result.trip.operatorName,
        departTime: result.trip.departTime,
        arriveTime: result.trip.arriveTime,
        arriveNote: result.trip.arriveNote,
        date: result.trip.date,
        durationLabel: result.trip.durationLabel,
        unitPrice: toNumber(result.trip.unitPrice),
        companyTripId: result.trip.companyTripId,
        companyId: result.trip.companyId,
        tripDbId: result.trip.tripDbId,
      },
      passenger: {
        fullName: passenger.fullName,
        phone: passenger.phone,
        pickupPointDefault: passenger.pickupPoint,
        dropoffPointDefault: passenger.dropoffPoint,
        pickupPointOptions:
          config?.catalog.pickupPoints.map((point) => ({
            value: point.value,
            label: point.label,
          })) ?? [],
        dropoffPointOptions:
          config?.catalog.dropoffPoints.map((point) => ({
            value: point.value,
            label: point.label,
          })) ?? [],
      },
    },
    seats: result.seats.map((seat) => ({
      id: seat.id,
      label: seat.label,
    })),
    addons: mapAddonsForConfirm(result.addons),
    addonLines: result.addons,
    paymentMethodId: result.payment.methodId,
    ...pricing,
  };
};

const mapNotification = (
  notification: BookingResultNotificationDto,
): NotifItem => ({
  id: notification.id,
  icon:
    notification.color === "green"
      ? "ti-mail"
      : notification.color === "amber"
        ? "ti-phone-call"
        : "ti-info-circle",
  colorClass: notification.color,
  title: notification.title,
  desc: notification.desc,
});

export const buildSuccessDataFromResult = (
  result: BookingResultResponseDto,
  config?: ClientBookingConfigResponseDto,
): BookingSuccessData => ({
  ...buildConfirmDataFromResult(result, config),
  trip: {
    bookingId: result.bookingId,
    operatorShortName: result.ticket.operatorShortName,
    operatorName: result.trip.operatorName,
    busType: result.ticket.busType,
    rating: result.ticket.rating,
    hasInsurance: result.ticket.hasInsurance,
    departTime: result.trip.departTime,
    departCity: result.trip.from,
    departStation: result.ticket.departStation,
    arriveTime: result.trip.arriveTime,
    arriveTimeNote: result.trip.arriveNote,
    arriveCity: result.trip.to,
    arriveStation: result.ticket.arriveStation,
    durationLabel: result.trip.durationLabel,
    stopsLabel: result.ticket.stopsLabel,
    date: result.trip.date,
    boardAt: result.ticket.boardAt,
    alightAt: result.ticket.alightAt,
    qrCode: result.ticket.qrCode,
    paymentMethod: {
      label: result.payment.label,
      last4: result.payment.last4 ?? "",
    },
  },
  notifications: result.notifications.map(mapNotification),
  nextActions: defaultNextActions,
});

const colorByCode = (code: string) => {
  let hash = 0;
  for (const char of code) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 45%, 28%)`;
};

export const mapCompanyTripToTripCard = (trip: ClientTripDto): Trip => {
  const company = trip.company;
  const road = trip.road;
  const vehicle = trip.vehicle;
  const totalSeats = toNumber(vehicle?.seatCount);
  const bookedSeats = toNumber(trip.bookedSeats);
  const availableSeats =
    trip.availableSeats ?? Math.max(0, totalSeats - bookedSeats);
  const operatorCode = company?.code ?? "BUS";
  const vehicleType = vehicle?.type
    ? API_VEHICLE_TYPE_LABEL[vehicle.type] ?? vehicle.type
    : "Xe khach";
  const vehicleLabel = vehicle?.name || vehicleType;
  const price = toNumber(trip.seatPrice);

  return {
    id: String(trip.id),
    featured: availableSeats <= 4,
    operator: {
      code: operatorCode.slice(0, 3).toUpperCase(),
      logoColor: colorByCode(operatorCode),
      name: company?.companyName ?? "Nha xe",
      vehicleType: vehicleLabel,
      rating: 4.8,
      reviewCount: "0",
    },
    departure: {
      time: trip.departure,
      city: road?.startPoint ?? "",
      station: road?.startPoint ?? "",
    },
    arrival: {
      time: trip.arrival,
      city: road?.endPoint ?? "",
      station: road?.endPoint ?? "",
    },
    duration: road?.standardDuration ? `~${road.standardDuration}` : "",
    stopLabel: "Thang, khong dung",
    price,
    seatsLeft: availableSeats,
    badges: [
      {
        type: availableSeats > 0 ? "green" : "red",
        label: availableSeats > 0 ? "Con ve" : "Het ve",
      },
      { type: "blue", label: vehicleType },
    ],
    amenities: [
      { icon: "wifi", label: "Wifi" },
      { icon: "ac", label: "Dieu hoa" },
    ],
  };
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
};

export interface ProfileBookingViewModel {
  id: number;
  route: string;
  date: string;
  time: string;
  passengerName: string;
  seat: string;
  pickup: string;
  dropoff: string;
  paymentMethod: string;
  status: "Confirmed" | "Pending" | "Unpaid";
  bookingCode: string;
  contactPhone: string;
  contactEmail: string;
  note: string;
}

export const mapAccountBookingToView = (
  booking: ClientAccountBookingDto,
): ProfileBookingViewModel => {
  const schedule = booking.schedule;
  const trip = schedule?.trip;
  const road = schedule?.road ?? trip?.road ?? null;
  const passenger = booking.passenger;
  const seatLabels =
    booking.seats?.length
      ? booking.seats.map((seat) => seat.name || seat.code || String(seat.id))
      : booking.seatIds?.map((id) => String(id));
  const status =
    booking.status === "CONFIRMED"
      ? "Confirmed"
      : booking.status === "HOLD" || booking.status === "CONVERTED"
        ? "Unpaid"
        : "Pending";

  return {
    id: booking.id,
    route: `${road?.startPoint ?? "..."} -> ${road?.endPoint ?? "..."}`,
    date: formatDate(booking.createdAt),
    time: trip?.departure ?? "",
    passengerName: passenger?.fullName ?? booking.customerId,
    seat: seatLabels?.join(", ") || "-",
    pickup: passenger?.pickupPoint ?? "-",
    dropoff: passenger?.dropoffPoint ?? "-",
    paymentMethod: booking.paymentMethodId ?? "-",
    status,
    bookingCode: booking.code,
    contactPhone: passenger?.phone ?? "",
    contactEmail: "",
    note: booking.promoCode ? `Promo: ${booking.promoCode}` : "",
  };
};
