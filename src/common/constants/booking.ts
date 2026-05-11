import type { RowDef, SeatDef, SeatStatus, VehicleConfig, VehicleType } from "@/common/types/booking";

const createSeat = (
  id: string,
  status: SeatStatus = "available",
): SeatDef => ({
  id,
  status,
});

const LAYOUT_16: RowDef[] = [
  {
    row: 1,
    seats: [
      createSeat("A1", "vip"),
      createSeat("A2"),
      null,
      createSeat("A3"),
      createSeat("A4", "booked"),
    ],
  },
  {
    row: 2,
    seats: [
      createSeat("B1"),
      createSeat("B2"),
      null,
      createSeat("B3", "booked"),
      createSeat("B4"),
    ],
  },
  {
    row: 3,
    seats: [
      createSeat("C1"),
      createSeat("C2", "booked"),
      null,
      createSeat("C3"),
      createSeat("C4"),
    ],
  },
  {
    row: 4,
    seats: [
      createSeat("D1"),
      createSeat("D2"),
      null,
      createSeat("D3"),
      createSeat("D4", "booked"),
    ],
  },
  {
    row: 5,
    seats: [
      createSeat("E1"),
      createSeat("E2"),
      createSeat("E3"),
      createSeat("E4", "booked"),
      createSeat("E5"),
    ],
    full: true,
  },
];

const makeFloor = (prefix: string, bookedNums: number[]): RowDef[] =>
  Array.from({ length: 9 }, (_, r) => ({
    row: r + 1,
    seats: [1, 2, null, 3, 4].map((c) => {
      if (c === null) return null;
      const num = r * 4 + c;
      const id = `${prefix}${String.fromCharCode(65 + r)}${c}`;
      return createSeat(
        id,
        bookedNums.includes(num)
          ? "booked"
          : c === 1 && r < 2
            ? "vip"
            : "available",
      );
    }),
  }));

const LAYOUT_36_F1 = makeFloor("F1", [2, 6, 11, 14, 20, 24, 28, 30, 35]);
const LAYOUT_36_F2 = makeFloor("F2", [1, 5, 9, 13, 18, 22, 25, 29, 33]);

const makeLayout45 = (): RowDef[] => {
  const booked = new Set([2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32]);
  let num = 0;
  const rows: RowDef[] = Array.from({ length: 9 }, (_, r) => ({
    row: r + 1,
    seats: [0, 1, null, 2, 3].map((c) => {
      if (c === null) return null;
      num++;
      return createSeat(`S${num}`, booked.has(num) ? "booked" : "available");
    }),
  }));
  const backRow: RowDef = {
    row: 10,
    full: true,
    seats: Array.from({ length: 5 }, () => {
      num++;
      return createSeat(`S${num}`, booked.has(num) ? "booked" : "available");
    }),
  };
  return [...rows, backRow];
};

export const VEHICLES: Record<VehicleType, VehicleConfig> = {
  "16": {
    label: "Xe 16 chỗ",
    icon: "ti-car-suv",
    mapTitle: "Xe 16 chỗ — Limousine SUV",
    mapSub: "Chọn ghế bạn muốn ngồi. Tối đa 4 ghế mỗi lần đặt.",
    floors: 1,
    layout: LAYOUT_16,
  },
  "36": {
    label: "Giường nằm 36",
    icon: "ti-bus",
    mapTitle: "Giường nằm 36 chỗ — 2 tầng",
    mapSub: "Xe 2 tầng — mỗi tầng 18 giường. Chọn tầng bên dưới.",
    floors: 2,
    floor1: LAYOUT_36_F1,
    floor2: LAYOUT_36_F2,
    isSleeper: true,
  },
  "45": {
    label: "Ghế ngồi 45",
    icon: "ti-bus",
    mapTitle: "Xe ghế ngồi 45 chỗ",
    mapSub: "Ghế ngồi tiêu chuẩn — có điều hoà, wifi.",
    floors: 1,
    layout: makeLayout45(),
  },
};

export const UNIT_PRICE = 350000;
export const FEE_RATE = 0.05;
export const MAX_SEATS = 4;

