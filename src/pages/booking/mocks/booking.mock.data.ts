/**
 * Fake data for Booking UI
 * This file contains mock data matching the types in booking.ui.types.ts
 */

import type {
  AddonService,
  BookingConfirmData,
  BookingPageData,
  BookingSuccessData,
  BookingSuccessTripInfo,
  ConfirmedAddon,
  NotifItem,
  NextAction,
  OperatorAmenity,
  PaymentMethod,
  PolicyItem,
  PointOption,
  PromoCode,
  RowDef,
  SeatDef,
  SelectedSeat,
  StepItem,
  TripInfo,
  UserInfo,
  VehicleConfig,
} from "../types/booking.ui.types";

// ==================== USER & AUTH ====================
export const mockUserInfo: UserInfo = {
  userName: "Nguyễn An",
  notifCount: 3,
  phone: "098 765 4321",
};

export const mockBreadcrumb = [
  { label: "Trang chủ", href: "/" },
  { label: "Vé xe", href: "/booking" },
  { label: "Chọn ghế", href: "/booking/seat" },
];

// ==================== PASSENGER ====================
export const mockPointOptions: PointOption[] = [
  { value: "mydinh", label: "Mỹ Đình" },
  { value: "giapbat", label: "Giáp Bát" },
  { value: "nuocngam", label: "Nước Ngầm" },
];

export const mockDropoffPointOptions: PointOption[] = [
  { value: "mienDong", label: "Miền Đông" },
  { value: "mienTay", label: "Miền Tây" },
  { value: "binhTrieu", label: "Bình Triệu" },
];

export const mockPassengerInfo = {
  fullName: "Nguyễn Văn An",
  phone: "098 765 4321",
  pickupPointDefault: "mydinh",
  dropoffPointDefault: "mienDong",
  pickupPointOptions: mockPointOptions,
  dropoffPointOptions: mockDropoffPointOptions,
};

// ==================== TRIP ====================
export const mockTripInfo: TripInfo = {
  from: "Hà Nội",
  to: "TP. Hồ Chí Minh",
  operatorName: "GoRide Express",
  operatorCode: "GR",
  departTime: "06:00",
  arriveTime: "14:00",
  arriveNote: "(+1)",
  date: "11/05/2026",
  durationLabel: "~32 tiếng",
  unitPrice: 850000,
};

// ==================== SEAT ====================
export const mockSeatDef: SeatDef = {
  id: "A1",
  status: "available",
};

export const mockSelectedSeats: SelectedSeat[] = [
  { id: "A1", label: "A1" },
  { id: "A2", label: "A2" },
];

export const mockRowDef: RowDef[] = [
  {
    row: 1,
    seats: [
      { id: "A1", status: "available" },
      { id: "A2", status: "available" },
      null,
      { id: "B1", status: "available" },
      { id: "B2", status: "booked" },
    ],
  },
  {
    row: 2,
    seats: [
      { id: "A3", status: "vip" },
      { id: "A4", status: "available" },
      null,
      { id: "B3", status: "available" },
      { id: "B4", status: "available" },
    ],
  },
];

// ==================== ADDON SERVICE ====================
export const mockAddonServices: AddonService[] = [
  {
    id: "water",
    icon: "ti-bottle",
    name: "Nước uống",
    desc: "Nước suối 500ml",
    price: 10000,
    hasQty: true,
  },
  {
    id: "blanket",
    icon: "ti-blanket",
    name: "Chăn ủ",
    desc: "Chăn ủ ấm áp",
    price: 20000,
    hasQty: false,
  },
  {
    id: "pillow",
    icon: "ti-pillow",
    name: "Gối mềm",
    desc: "Gối êm ái",
    price: 15000,
    hasQty: false,
  },
  {
    id: "wifi",
    icon: "ti-wifi",
    name: "Wifi Premium",
    desc: "Wifi tốc độ cao",
    price: 0,
    hasQty: false,
  },
];

export const mockConfirmedAddons: ConfirmedAddon[] = [
  {
    id: "water",
    icon: "ti-bottle",
    name: "Nước uống",
    price: 20000,
  },
  {
    id: "blanket",
    icon: "ti-blanket",
    name: "Chăn ủ",
    price: 20000,
  },
];

// ==================== PROMO CODE ====================
export const mockPromoCodes: PromoCode[] = [
  {
    code: "GIAM20",
    icon: "ti-tag",
    discount: "Giảm 20%",
    desc: "Giảm 20% tổng đơn",
    type: "percent",
    value: 0.2,
    max: 200000,
  },
  {
    code: "GIAM50K",
    icon: "ti-tag",
    discount: "Giảm 50K",
    desc: "Giảm 50.000đ",
    type: "fixed",
    value: 50000,
  },
  {
    code: "FREESHIP",
    icon: "ti-tag",
    discount: "Miễn phí",
    desc: "Miễn phí dịch vụ",
    type: "fixed",
    value: 0,
  },
];

// ==================== PAYMENT ====================
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "card",
    icon: "ti-credit-card",
    iconColor: "#0a0e1a",
    name: "Thẻ tín dụng / ghi nợ",
    desc: "Visa, Mastercard, JCB",
  },
  {
    id: "ewallet",
    icon: "ti-wallet",
    iconColor: "#fff",
    iconBg: "#ee4d2d",
    name: "Ví điện tử",
    desc: "MoMo, ZaloPay, VNPay",
  },
  {
    id: "bank",
    icon: "ti-building-bank",
    iconColor: "#1d4ed8",
    name: "Chuyển khoản ngân hàng",
    desc: "Internet Banking",
  },
  {
    id: "cash",
    icon: "ti-cash",
    iconColor: "#16a34a",
    name: "Tiền mặt",
    desc: "Thanh toán tại quầy",
  },
];

// ==================== POLICY ====================
export const mockPolicies: PolicyItem[] = [
  {
    icon: "ti-clock",
    title: "Hoàn vé",
    tagLabel: "Linh hoạt",
    tagVariant: "green",
    desc: "Hoàn 80% nếu huỷ trước 24h, 50% trước 6h",
  },
  {
    icon: "ti-shield-check",
    title: "Bảo hiểm",
    tagLabel: "Bắt buộc",
    tagVariant: "blue",
    desc: "Bảo hiểm hành trình miễn phí",
  },
  {
    icon: "ti-luggage",
    title: "Hành lý",
    tagLabel: "20kg",
    tagVariant: "amber",
    desc: "Miễn phí 20kg hành lý",
  },
];

// ==================== OPERATOR AMENITY ====================
export const mockOperatorAmenities: OperatorAmenity[] = [
  { icon: "ti-wifi", label: "Wifi 5G" },
  { icon: "ti-air-conditioning", label: "Điều hòa" },
  { icon: "ti-device-tv", label: "TV" },
  { icon: "ti-cup", label: "Nước uống" },
  { icon: "ti-usb", label: "USB" },
  { icon: "ti-bolt", label: "Sạc" },
];

// ==================== VEHICLE ====================
export const mockVehicleConfigs: Record<string, VehicleConfig> = {
  "16": {
    label: "16 chỗ",
    icon: "ti-bus",
    mapTitle: "Ghế ngồi 16 chỗ",
    mapSub: "2-2 layout, điều hòa, wifi",
    floors: 1,
    isSleeper: false,
  },
  "24": {
    label: "24 chỗ",
    icon: "ti-bus",
    mapTitle: "Ghế ngồi 24 chỗ",
    mapSub: "2-2 layout, điều hòa, wifi",
    floors: 1,
    isSleeper: false,
  },
  "32": {
    label: "32 chỗ",
    icon: "ti-bus",
    mapTitle: "Ghế ngồi 32 chỗ",
    mapSub: "2-2 layout, điều hòa, wifi",
    floors: 1,
    isSleeper: false,
  },
  "40": {
    label: "40 chỗ",
    icon: "ti-bed",
    mapTitle: "Giường nằm 40 chỗ",
    mapSub: "2 tầng, điều hòa, wifi",
    floors: 2,
    isSleeper: true,
  },
  "45": {
    label: "45 chỗ",
    icon: "ti-bed",
    mapTitle: "Giường nằm VIP 45 chỗ",
    mapSub: "2 tầng, điều hòa, wifi",
    floors: 2,
    isSleeper: true,
  },
};

// ==================== NOTIFICATION ====================
export const mockNotifications: NotifItem[] = [
  {
    id: "notif-1",
    icon: "ti-mail",
    colorClass: "green",
    title: "Vé đã gửi",
    desc: "Vé điện tử đã được gửi đến email của bạn",
  },
  {
    id: "notif-2",
    icon: "ti-phone-call",
    colorClass: "amber",
    title: "Xác nhận SMS",
    desc: "Mã xác nhận đã được gửi đến số điện thoại",
  },
  {
    id: "notif-3",
    icon: "ti-info-circle",
    colorClass: "blue",
    title: "Thông tin chuyến đi",
    desc: "Vui lòng có mặt tại bến xe 30 phút trước giờ khởi hành",
  },
];

// ==================== NEXT ACTION ====================
export const mockNextActions: NextAction[] = [
  {
    id: "action-1",
    icon: "ti-download",
    label: "Tải vé PDF",
    desc: "Lưu vé điện tử vào thiết bị",
    prompt: "download_ticket",
  },
  {
    id: "action-2",
    icon: "ti-share",
    label: "Chia sẻ vé",
    desc: "Gửi vé cho người thân",
    prompt: "share_ticket",
  },
  {
    id: "action-3",
    icon: "ti-home",
    label: "Về trang chủ",
    desc: "Đặt vé chuyến khác",
    prompt: "go_home",
  },
  {
    id: "action-4",
    icon: "ti-history",
    label: "Lịch sử đặt vé",
    desc: "Xem các vé đã đặt",
    prompt: "view_history",
  },
];

// ==================== STEP ====================
export const mockBookingSteps: StepItem[] = [
  { label: "Đặt ghế" },
  { label: "Thông tin hành khách" },
  { label: "Xác nhận thông tin" },
  { label: "Hoàn tất" },
];

export const mockConfirmSteps: StepItem[] = [
  { label: "Chọn tuyến" },
  { label: "Chọn ghế" },
  { label: "Xác nhận" },
  { label: "Thanh toán" },
];

// ==================== BOOKING PAGE DATA ====================
export const mockBookingPageData: BookingPageData = {
  user: mockUserInfo,
  breadcrumb: mockBreadcrumb,
  trip: mockTripInfo,
  passenger: mockPassengerInfo,
};

// ==================== BOOKING CONFIRM DATA ====================
export const mockBookingConfirmData: BookingConfirmData = {
  pageData: mockBookingPageData,
  seats: mockSelectedSeats,
  addons: mockConfirmedAddons,
  subTotal: 1700000,
  addonsTotal: 40000,
  fee: 85000,
  promoCode: "GIAM20",
  promoDiscount: 200000,
  total: 1625000,
  holdSeconds: 600,
};

// ==================== BOOKING SUCCESS TRIP INFO ====================
export const mockBookingSuccessTripInfo: BookingSuccessTripInfo = {
  bookingId: "8812A8192777",
  operatorShortName: "GR",
  operatorName: "GoRide Express",
  busType: "Giường nằm VIP 40 chỗ",
  rating: 4.9,
  hasInsurance: true,
  departTime: "06:00",
  departCity: "Hà Nội",
  departStation: "Mỹ Đình",
  arriveTime: "14:00",
  arriveTimeNote: "(+1)",
  arriveCity: "TP. Hồ Chí Minh",
  arriveStation: "Miền Đông",
  durationLabel: "~32 tiếng",
  stopsLabel: "Thẳng, không dừng",
  date: "11/05/2026",
  boardAt: "05:30",
  alightAt: "14:30",
  qrCode: "QR8812A8192777",
  paymentMethod: {
    label: "Thẻ tín dụng",
    last4: "4242",
  },
};

// ==================== BOOKING SUCCESS DATA ====================
export const mockBookingSuccessData: BookingSuccessData = {
  ...mockBookingConfirmData,
  trip: mockBookingSuccessTripInfo,
  notifications: mockNotifications,
  nextActions: mockNextActions,
};

// ==================== COMPLETE MOCK OBJECT ====================
export const mockBookingData = {
  // User & Auth
  userInfo: mockUserInfo,
  breadcrumb: mockBreadcrumb,

  // Passenger
  passenger: mockPassengerInfo,
  pointOptions: mockPointOptions,
  dropoffPointOptions: mockDropoffPointOptions,

  // Trip
  trip: mockTripInfo,

  // Seat
  seatDef: mockSeatDef,
  selectedSeats: mockSelectedSeats,
  rowDef: mockRowDef,

  // Addon
  addonServices: mockAddonServices,
  confirmedAddons: mockConfirmedAddons,

  // Promo
  promoCodes: mockPromoCodes,

  // Payment
  paymentMethods: mockPaymentMethods,

  // Policy
  policies: mockPolicies,

  // Operator
  operatorAmenities: mockOperatorAmenities,

  // Vehicle
  vehicleConfigs: mockVehicleConfigs,

  // Notification
  notifications: mockNotifications,

  // Next Action
  nextActions: mockNextActions,

  // Steps
  bookingSteps: mockBookingSteps,
  confirmSteps: mockConfirmSteps,

  // Complete Data Objects
  bookingPageData: mockBookingPageData,
  bookingConfirmData: mockBookingConfirmData,
  bookingSuccessData: mockBookingSuccessData,
};
