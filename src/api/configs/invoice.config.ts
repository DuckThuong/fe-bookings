import axiosClient from "../axiosClient";
import type {
  PaymentInvoice,
  RefundInvoice,
  InvoicePaginated,
  InvoiceSummary,
  InvoiceQuery,
  RefundQuery,
} from "../dtos/invoice.dto";
import { InvoiceEndPoints } from "../endpoints/invoice.endpoint";

export const getPaymentInvoices = async (
  params?: InvoiceQuery,
): Promise<InvoicePaginated<PaymentInvoice>> => {
  const response = await axiosClient.get<InvoicePaginated<PaymentInvoice>>(
    InvoiceEndPoints.PAYMENTS,
    { params },
  );
  return response.data;
};

export const getRefundInvoices = async (
  params?: RefundQuery,
): Promise<InvoicePaginated<RefundInvoice>> => {
  const response = await axiosClient.get<InvoicePaginated<RefundInvoice>>(
    InvoiceEndPoints.REFUNDS,
    { params },
  );
  return response.data;
};

export const getInvoiceSummary = async (): Promise<InvoiceSummary> => {
  const response = await axiosClient.get<InvoiceSummary>(InvoiceEndPoints.SUMMARY);
  return response.data;
};
