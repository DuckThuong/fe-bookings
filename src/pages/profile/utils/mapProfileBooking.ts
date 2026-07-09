import type {
  AccountBookingDetail,
  AccountBookingItem,
} from "@/api/dtos/account.dto";
import dayjs from "dayjs";

export type ProfileBookingStatus = string;

export type OperationStatus =
  | "SCHEDULED"
  | "PREPARING"
  | "BOARDING"
  | "DEPARTED"
  | "APPROACHING"
  | "MOVING"
  | "ARRIVED"
  | "COMPLETED"
  | "CANCELLED"
  | "DELAYED";

export interface RefundInfo {
  refundCode?: string;
  refundPercentage?: number;
  estimatedRefundAmount?: number;
  refundStatus?: string;
  requestedAt?: string;
  processedAt?: string;
}

export interface ProfileBooking {
  id: string;
  holdCode: string;
  route: string;
  date: string;
  time: string;
  passengerName: string;
  seat: string;
  pickup: string;
  dropoff: string;
  pickupValue: string;
  dropoffValue: string;
  paymentMethod: string;
  status: string; // Status code from backend
  rawStatus: string;
  bookingCode: string;
  contactPhone: string;
  contactEmail: string;
  note: string;
  canEdit: boolean;
  operatorCode?: string;
  operatorName?: string;
  operatorUserId?: number;
  operationStatus?: OperationStatus;
  refundInfo?: RefundInfo;
  departureTime?: string;
  totalAmount?: number;
}

const PAYMENT_LABELS: Record<string, string> = {
  card: "Thẻ tín dụng / ghi nợ",
  ewallet: "Ví điện tử",
  bank: "Chuyển khoản ngân hàng",
  cash: "Tiền mặt",
};

const formatSeatLabel = (
  item: AccountBookingItem | AccountBookingDetail,
): string => {
  const detail = item as AccountBookingDetail;
  if (detail.seats?.length) {
    return detail.seats.map((s) => s.name || s.code).join(", ");
  }
  if (item.totalSeat > 1) return `${item.totalSeat} ghế`;
  if (item.totalSeat === 1) return "1 ghế";
  return "—";
};

export const mapBookingStatus = (
  item: AccountBookingItem,
  ticketStatus?: string | null,
  holdExpiresAt?: string | null,
): string => {
  const status = item.status?.toUpperCase() ?? "";
  const ticket = ticketStatus?.toUpperCase() ?? "";

  if (ticket === "REFUNDING" || ticket === "PENDING_REFUND") {
    return "REFUNDING";
  }

  if (
    status === "CANCELLED" ||
    ticket === "CANCELLED" ||
    ticket === "REFUNDED"
  ) {
    return "CANCELLED";
  }

  // Check if HOLD booking has expired
  if (status === "HOLD" && holdExpiresAt) {
    if (new Date() > new Date(holdExpiresAt)) {
      return "CANCELLED";
    }
  }

  if (status === "HOLD") return "UNPAID";
  if (status === "CONFIRMED") return "CONFIRMED";

  if (
    status === "PENDING_APPROVAL" ||
    (status === "CONVERTED" && ticket === "PENDING")
  ) {
    return "PENDING";
  }

  if (status === "CONVERTED" && ticket === "PAID") return "WAITING";

  return "UNPAID";
};

const canEditBooking = (item: AccountBookingItem): boolean => {
  if (item.status !== "HOLD") return false;
  const expiresAt = dayjs(item.holdExpiresAt);
  return expiresAt.isValid() && expiresAt.isAfter(dayjs());
};

export const mapAccountBookingToProfile = (
  item: AccountBookingItem | AccountBookingDetail,
  contactEmail = "",
): ProfileBooking => {
  const road = item.schedule?.road;
  const trip = item.schedule?.trip;
  const passenger = item.passenger;
  const detail = item as AccountBookingDetail;
  const ticket = detail.ticket;
  const ticketStatus = ticket?.status ?? null;

  const route =
    road?.startPoint && road?.endPoint
      ? `${road.startPoint} → ${road.endPoint}`
      : (trip?.name ?? "—");

  const pickupFromRoad = road?.startPoint;
  const dropoffFromRoad = road?.endPoint;

  const hasPassenger = passenger && Object.keys(passenger).length > 0;

  const refundInfo: RefundInfo | undefined = detail.refundInfo
    ? {
        refundCode: detail.refundInfo.refundCode,
        refundPercentage: detail.refundInfo.refundPercentage,
        estimatedRefundAmount: detail.refundInfo.estimatedRefundAmount,
        refundStatus: detail.refundInfo.refundStatus,
        requestedAt: detail.refundInfo.requestedAt,
        processedAt: detail.refundInfo.processedAt,
      }
    : undefined;

  return {
    id: String(item.id),
    holdCode: item.code,
    route,
    date: dayjs(item.createdAt).format("DD/MM/YYYY"),
    time: trip?.departure ?? "—",
    passengerName: passenger?.fullName ?? "—",
    seat: formatSeatLabel(item),
    pickup: hasPassenger
      ? (passenger.pickupPoint ?? "—")
      : (pickupFromRoad ?? "—"),
    dropoff: hasPassenger
      ? (passenger.dropoffPoint ?? "—")
      : (dropoffFromRoad ?? "—"),
    pickupValue: hasPassenger
      ? (passenger.pickupPoint ?? "")
      : (pickupFromRoad ?? ""),
    dropoffValue: hasPassenger
      ? (passenger.dropoffPoint ?? "")
      : (dropoffFromRoad ?? ""),
    paymentMethod:
      PAYMENT_LABELS[item.paymentMethodId ?? ""] ?? item.paymentMethodId ?? "—",
    status: mapBookingStatus(item, ticketStatus, item.holdExpiresAt),
    rawStatus: item.status,
    bookingCode: ticket?.code ?? item.code,
    contactPhone: passenger?.phone ?? "",
    contactEmail,
    note: "",
    canEdit: canEditBooking(item),
    operatorCode: item.schedule?.company?.code,
    operatorName: item.schedule?.company?.companyName,
    operatorUserId: item.schedule?.company?.operatorUserId,
    operationStatus: detail.operationStatus as OperationStatus | undefined,
    refundInfo,
    departureTime: detail.departureTime,
    totalAmount: detail.totalAmount,
  };
};

export const toPassengerPayload = (booking: ProfileBooking) => ({
  fullName: booking.passengerName,
  phone: booking.contactPhone.replace(/\D/g, "").slice(-10),
  pickupPoint: booking.pickupValue,
  dropoffPoint: booking.dropoffValue,
});
