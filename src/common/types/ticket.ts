// ─── Types ───────────────────────────────────────────────

export interface TripAmenity {
  icon: string; // emoji hoặc text icon
  label: string;
}

export interface TripBadge {
  type: "green" | "amber" | "blue" | "gray" | "red";
  label: string;
}

export interface Trip {
  id: string;
  featured?: boolean;
  operator: {
    code: string; // 2 ký tự hiển thị trong logo
    logoColor: string;
    name: string;
    vehicleType: string;
    rating: number;
    reviewCount: string;
  };
  departure: { time: string; city: string; station: string };
  arrival: { time: string; city: string; station: string };
  duration: string;
  stopLabel: string;
  price: number;
  seatsLeft: number;
  badges: TripBadge[];
  amenities: TripAmenity[];
}

export type SeatType = "all" | "sleeper" | "seat" | "limousine" | "bus";
export type FilterKey = "all" | "morning" | "daytime" | "night" | "wifi" | "ac";
export type SortKey = "price" | "departure" | "duration" | "rating";

// ─── Seat types ──────────────────────────────────────────

export const SEAT_TYPES: { key: SeatType; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "sleeper", label: "Giường nằm" },
  { key: "seat", label: "Ghế ngồi" },
  { key: "limousine", label: "VIP Limousine" },
  { key: "bus", label: "Xe khách" },
];

// ─── Filter chips ─────────────────────────────────────────

export const FILTER_CHIPS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Tất cả giờ" },
  { key: "morning", label: "🌅 Sáng sớm" },
  { key: "daytime", label: "☀️ Ban ngày" },
  { key: "night", label: "🌙 Ban đêm" },
  { key: "wifi", label: "📶 Có Wifi" },
  { key: "ac", label: "❄️ Điều hoà" },
];

// ─── Sort options ─────────────────────────────────────────

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "price", label: "Giá thấp nhất" },
  { key: "departure", label: "Giờ khởi hành" },
  { key: "duration", label: "Thời gian ngắn nhất" },
  { key: "rating", label: "Đánh giá cao nhất" },
];
