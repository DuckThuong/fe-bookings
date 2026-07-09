import { useState, useEffect, useCallback } from "react";
import { getAllStatuses } from "@/api/configs/master.config";
import type { MasterDataAllResponse } from "@/api/dtos/master.dto";

export interface BookingStatusMeta {
  label: string;
  color: string;
  bg: string;
}

export const useBookingStatuses = () => {
  const [data, setData] = useState<MasterDataAllResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllStatuses();
      setData(response);
    } catch (err) {
      console.error("Failed to fetch booking statuses:", err);
      setError("Failed to load booking statuses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toStatusMetaMap = useCallback(
    (items: { code: string; name: string; rule?: string }[]): Record<string, BookingStatusMeta> => {
      const result: Record<string, BookingStatusMeta> = {};
      for (const item of items) {
        const color = item.rule || "#64748b";
        result[item.code] = {
          label: item.name,
          color,
          bg: `${color}1a`,
        };
      }
      return result;
    },
    [],
  );

  const bookingStatusMeta = data?.bookingStatuses
    ? toStatusMetaMap(data.bookingStatuses)
    : {};

  const getBookingStatusMeta = useCallback(
    (code: string): BookingStatusMeta | undefined => {
      return bookingStatusMeta[code];
    },
    [bookingStatusMeta],
  );

  return {
    data,
    loading,
    error,
    bookingStatuses: data?.bookingStatuses ?? [],
    bookingStatusMeta,
    getBookingStatusMeta,
    refetch: fetchData,
  };
};
