export interface PaymentInvoice {
  id: number;
  code: string;
  amount: number;
  method: string;
  methodDisplay: string;
  status: string;
  paidAt: string | null;
  transactionRef: string | null;
  createdAt: string;
  trip?: {
    departure?: string;
    arrival?: string;
    name?: string;
    date?: string;
    time?: string;
  } | null;
  company?: {
    code: string;
    companyName: string;
  } | null;
  ticket?: {
    id: number;
    code: string;
    totalSeat: number;
  } | null;
}

export interface RefundInvoice {
  id: number;
  code: string;
  amount: number;
  reason: string | null;
  status: string;
  refundedAt: string | null;
  createdAt: string;
  trip?: {
    departure?: string;
    arrival?: string;
    name?: string;
    date?: string;
    time?: string;
  } | null;
  company?: {
    code: string;
    companyName: string;
  } | null;
  payment?: {
    code: string;
    amount: number;
    method: string;
    methodDisplay: string;
  } | null;
}

export interface InvoicePaginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InvoiceSummary {
  totalSpent: number;
  totalPayments: number;
  pendingRefunds: number;
}

export interface InvoiceQuery {
  page?: number;
  limit?: number;
  status?: string;
  method?: string;
  fromDate?: string;
  toDate?: string;
}

export interface RefundQuery {
  page?: number;
  limit?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
}
