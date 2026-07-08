export interface AccountBookingQuery {
  page?: number;
  limit?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface AccountPaginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AccountBookingPassenger {
  fullName: string;
  phone: string;
  pickupPoint: string;
  dropoffPoint: string;
}

export interface AccountBookingScheduleRoad {
  startPoint: string;
  endPoint: string;
  standardDuration?: string;
}

export interface AccountBookingScheduleTrip {
  departure?: string;
  arrival?: string;
  name?: string;
}

export interface AccountBookingScheduleCompany {
  code: string;
  companyName: string;
  operatorUserId?: number;
}

export interface AccountBookingSchedule {
  trip?: AccountBookingScheduleTrip | null;
  road?: AccountBookingScheduleRoad | null;
  company?: AccountBookingScheduleCompany | null;
}

export interface AccountBookingSeat {
  id: number;
  code: string;
  name: string;
  index?: string;
}

export interface AccountBookingTicket {
  id: number;
  code: string;
  status: string;
}

export interface AccountBookingItem {
  id: number;
  code: string;
  status: string;
  customerId: string;
  seatIds: number[];
  totalSeat: number;
  passenger: AccountBookingPassenger | null;
  paymentMethodId?: string | null;
  ticketId?: number | null;
  holdExpiresAt: string;
  createdAt: string;
  schedule?: AccountBookingSchedule | null;
}

export interface RefundInfoDto {
  refundCode?: string;
  refundPercentage?: number;
  estimatedRefundAmount?: number;
  refundStatus?: string;
  requestedAt?: string;
  processedAt?: string;
}

export interface AccountBookingDetail extends AccountBookingItem {
  seats?: AccountBookingSeat[];
  ticket?: AccountBookingTicket | null;
  operationStatus?: string;
  refundInfo?: RefundInfoDto;
  departureTime?: string;
  totalAmount?: number;
}
