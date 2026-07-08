import axiosClient from "../axiosClient";

const API_VERSION = "v1";

export { API_VERSION };

export const paymentConfig = {
  baseUrl: `/api/${API_VERSION}/payments/payos`,

  createPaymentLink: async (ticketId: number, description?: string) => {
    const response = await axiosClient.post(`${paymentConfig.baseUrl}/create-link`, {
      ticketId,
      description,
    });
    return response.data;
  },

  getPaymentStatus: async (paymentLinkId: string) => {
    const response = await axiosClient.get(
      `${paymentConfig.baseUrl}/status/${paymentLinkId}`
    );
    return response.data;
  },

  cancelPayment: async (paymentLinkId: string) => {
    const response = await axiosClient.post(
      `${paymentConfig.baseUrl}/cancel/${paymentLinkId}`
    );
    return response.data;
  },
};

export const createPayOSPayment = (ticketId: number, description?: string) =>
  paymentConfig.createPaymentLink(ticketId, description);

export const getPaymentStatus = (paymentLinkId: string) =>
  paymentConfig.getPaymentStatus(paymentLinkId);

export const cancelPayment = (paymentLinkId: string) =>
  paymentConfig.cancelPayment(paymentLinkId);

// Booking-specific payment (creates PayOS link from hold)
export const createBookingPaymentLink = async (holdId: string) => {
  const response = await axiosClient.post(
    `/api/${API_VERSION}/bookings/hold/${holdId}/payment-link`
  );
  return response.data;
};

// Get booking info by payment link ID (for PayOS return page)
export const getBookingByPaymentLink = async (paymentLinkId: string) => {
  const response = await axiosClient.get(
    `/api/${API_VERSION}/bookings/by-payment/${paymentLinkId}`
  );
  return response.data;
};
