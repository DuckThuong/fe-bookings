export type SeatStatus = "available" | "booked" | "vip";
export type VehicleType = "16" | "36" | "45";

export interface SeatDef {
  id: string;
  status: SeatStatus;
}

export interface RowDef {
  row: number;
  seats: Array<SeatDef | null>;
  full?: boolean;
}

export interface VehicleConfig {
  label: string;
  icon: string;
  mapTitle: string;
  mapSub: string;
  floors: number;
  layout?: RowDef[];
  floor1?: RowDef[];
  floor2?: RowDef[];
  isSleeper?: boolean;
}

