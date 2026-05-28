export interface ClientPaginatedResponseDto<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ClientPaginationQueryDto {
  page?: number;
  limit?: number;
}

export interface ClientRoadQueryDto extends ClientPaginationQueryDto {
  companyId?: number;
  search?: string;
  startPoint?: string;
  endPoint?: string;
  status?: string;
}

export interface ClientCompanyTripQueryDto extends ClientPaginationQueryDto {
  companyId?: number;
  tripId?: number;
  roadId?: number;
  status?: string;
  minAvailableSeats?: number;
}

export interface ClientCompanyDto {
  id: number;
  userLeadId?: string;
  companyName: string;
  code: string;
  description?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  roadCount?: number;
  activeCompanyTripCount?: number;
}

export interface ClientRoadDto {
  id: number;
  companyId: number;
  code: string;
  name: string;
  length: number | string;
  status: string;
  startPoint: string;
  endPoint: string;
  totalTurn?: number;
  standardDuration?: string;
  tripsPerDay?: number;
  averageOccupancy?: number | string;
  estimatedRevenue?: number | string;
  leadVehicle?: string | null;
  demandLevel?: string | null;
  note?: string | null;
  company?: ClientCompanyDto | null;
}

export interface ClientTripDto {
  id: number;
  code: string;
  name: string;
  roadId: number;
  companyId: number;
  driverId: number;
  vehicleId: number;
  status: string;
  description?: string | null;
  departure: string;
  arrival: string;
  seatPrice: number | string;
  bookedSeats: number;
  road?: ClientRoadDto | null;
  company?: ClientCompanyDto | null;
}

export interface ClientVehicleDto {
  id: number;
  companyId: number;
  image?: string | null;
  code: string;
  type: string;
  schedule?: string | null;
  status: string;
  name: string;
  description?: string | null;
}

export interface ClientDriverDto {
  id: number;
  [key: string]: unknown;
}

export interface ClientSeatDto {
  id: number;
  vehicleId: number;
  code: string;
  name: string;
  type?: string;
  status: string;
  isOccupied?: boolean;
  [key: string]: unknown;
}

export interface ClientCompanyTripDto {
  id: number;
  companyId: number;
  tripId: number;
  vehicleId: number;
  driverId: number;
  description?: string | null;
  totalSeat: number;
  totalSeatBooked: number;
  totalPrice: number | string;
  pricePerSeat: number | string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  availableSeats?: number;
  occupiedSeatIds?: number[];
  company?: ClientCompanyDto | null;
  trip?: ClientTripDto | null;
  road?: ClientRoadDto | null;
  vehicle?: ClientVehicleDto | null;
  driver?: ClientDriverDto | null;
  seats?: ClientSeatDto[];
}
