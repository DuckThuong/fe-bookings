import { isAxiosError } from "axios";

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Khong the thuc hien yeu cau. Vui long thu lai.",
) => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (Array.isArray(message) && message[0]) {
      return String(message[0]);
    }

    if (typeof error.response?.data === "string") {
      return error.response.data;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
