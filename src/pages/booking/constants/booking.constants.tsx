import type { NextAction, PaymentMethod } from "../types/confirm.types";

export const BOOKING_STEPS = [
  { label: "Đặt ghế" },
  { label: "Thông tin hành khách" },
  { label: "Xác nhận thông tin" },
  { label: "Hoàn tất" },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "card",
    icon: "ti-credit-card",
    iconColor: "#0a0e1a",
    name: "Thẻ tín dụng / ghi nợ",
    desc: "Visa, Mastercard, JCB",
  },
  {
    id: "payos",
    icon: "ti-qrcode",
    iconColor: "#fff",
    iconBg: "#00856f",
    name: "PayOS",
    desc: "Thanh toán qua QR code",
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

export const BOOKING_NEXT_ACTIONS: NextAction[] = [
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
