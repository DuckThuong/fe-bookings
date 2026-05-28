import type {
  ClientCompanyDto,
  ClientCompanyTripDto,
  ClientPaginatedResponseDto,
  ClientSeatDto,
} from "./client-catalog.dto";
import type { AddonLineDto, PassengerDto } from "./client-booking.dto";

export interface ClientMyBookingQueryDto {
  customerId?: string;
  companyId?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface ClientAccountBookingDto {
  id: number;
  code: string;
  companyTripId: number;
  tripId: number;
  companyId: number;
  customerId: string;
  seatIds: number[];
  totalSeat: number;
  pricePerSeat: number | string;
  subtotal: number | string;
  discountAmount: number | string;
  totalPrice: number | string;
  promoCode?: string | null;
  status: string;
  holdExpiresAt: string;
  ticketId?: number | null;
  passenger: PassengerDto | null;
  addons: AddonLineDto[] | null;
  serviceFee: number | string;
  addonsTotal: number | string;
  vehicleType?: string | null;
  floor?: number | null;
  paymentMethodId?: string | null;
  createdAt: string;
  updatedAt: string;
  schedule?: ClientCompanyTripDto | null;
  seats?: ClientSeatDto[];
  ticket?: {
    id: number;
    code: string;
    status: string;
    [key: string]: unknown;
  } | null;
  company?: ClientCompanyDto | null;
}

export type ClientMyBookingsResponseDto =
  ClientPaginatedResponseDto<ClientAccountBookingDto>;
