import { CardNetwork } from "../constants/profile.constant";

export const formatCardNumber = (number: string): string => {
  const display = number
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
  const masked = display
    ? display.slice(0, -4).replace(/\d/g, "•") + display.slice(-4)
    : "•••• •••• •••• ••••";
  return masked;
};

// ─── Profile Page 1 Helpers ──────────────────────────────────
export const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("vi-VN").format(value ?? 0);

export const formatDate = (value?: string) => {
  if (!value) return "Chưa có dữ liệu";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

// ─── Profile Page 3 Helpers ──────────────────────────────────
export const getBase64 = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });

export const resolveApiMessage = (error: unknown, defaultMessage = "Đã xảy ra lỗi.") => {
  if (!error || typeof error !== "object") return defaultMessage;
  const isAxiosError = "response" in error && "data" in (error as { response?: unknown });
  if (!isAxiosError) return defaultMessage;
  const axiosError = error as { response?: { data?: { message?: string | string[] } } };
  const apiMessage = axiosError.response?.data?.message;
  if (typeof apiMessage === "string") return apiMessage;
  if (Array.isArray(apiMessage) && apiMessage[0]) return String(apiMessage[0]);
  return defaultMessage;
};
