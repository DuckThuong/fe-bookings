import type { PaymentMethod } from "../types/confirm.types";

export const PAYMENT_METHODS: PaymentMethod[] = [
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

export const STEPS = [
  { label: "Chọn tuyến" },
  { label: "Chọn ghế" },
  { label: "Xác nhận" },
  { label: "Thanh toán" },
];
