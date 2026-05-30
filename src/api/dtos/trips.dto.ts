import type { FilterKey, SeatType, SortKey, Trip } from "@/common/types/ticket";

export interface SearchTripsParams {
  fromCity?: string;
  toCity?: string;
  date?: string;
  passengers?: number;
  seatType?: SeatType;
  filters?: string;
  sortKey?: SortKey;
  page?: number;
  pageSize?: number;
}

export interface SearchTripsResponse {
  search: {
    from: string;
    to: string;
    date: string;
    passengers: number;
    seatType: SeatType;
  };
  meta: {
    resultCount: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
    sortKey: SortKey;
    filters: FilterKey[];
  };
  trips: Trip[];
}
