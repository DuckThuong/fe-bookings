export const HOME_CITIES = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
] as const;

export const HOME_DESTINATIONS = [
  "Đà Nẵng",
  "Đà Lạt",
  "Nha Trang",
  "Huế",
  "Vinh",
  "Vũng Tàu",
] as const;

export const HOME_QUICK_ROUTES: Array<{ from: string; to: string }> = [
  { from: "Hà Nội", to: "Đà Nẵng" },
  { from: "TP. Hồ Chí Minh", to: "Đà Lạt" },
  { from: "Hà Nội", to: "Vinh" },
  { from: "TP. Hồ Chí Minh", to: "Vũng Tàu" },
];

export const HOME_POPULAR_ROUTES: string[] = [
  "Hà Nội → Đà Nẵng",
  "TP. Hồ Chí Minh → Đà Lạt",
  "Hà Nội → TP. Hồ Chí Minh",
  "TP. Hồ Chí Minh → Nha Trang",
  "Hà Nội → Hải Phòng",
  "TP. Hồ Chí Minh → Cần Thơ",
];

