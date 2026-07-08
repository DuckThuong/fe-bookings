import type { PaymentMethod } from "../types/confirm.types";

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "cash",
    icon: "ti-cash",
    iconColor: "#16a34a",
    name: "Tiền mặt",
    desc: "Thanh toán tại quầy",
  },
];

export const CONFIRM_STEPS = [
  { label: "Chọn tuyến" },
  { label: "Chọn ghế" },
  { label: "Xác nhận" },
  { label: "Thanh toán" },
];
