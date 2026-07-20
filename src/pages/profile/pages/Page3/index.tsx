import { Button, Empty, Form, Spin } from "antd";
import { AxiosError, isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { getMyBooking, listMyBookings, requestRefund } from "@/api/configs/account.config";
import { updateHoldPassenger } from "@/api/configs/bookings.config";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
  NOTI_SUCCESS,
  SUCCESS_MESSAGE,
} from "@/common/constants/constants";
import { useUser } from "@/common/contexts/UserContext";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  mapAccountBookingToProfile,
  type ProfileBooking,
  toPassengerPayload,
} from "../../utils/mapProfileBooking";
import { BookingListItem, BookingDetail } from "./components";
import "./style.scss";

export const ProfileTicket = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const contactEmail = user?.userEmail ?? "";

  const listQuery = useQuery({
    queryKey: ["myBookings"],
    queryFn: () => listMyBookings({ page: 1, limit: 50 }),
  });

  const listBookings = useMemo(() => {
    const items = listQuery.data?.items ?? [];
    return items.map((item) =>
      mapAccountBookingToProfile(item, contactEmail),
    );
  }, [listQuery.data, contactEmail]);

  useEffect(() => {
    if (listBookings.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !listBookings.some((b) => b.id === selectedId)) {
      setSelectedId(listBookings[0].id);
    }
  }, [listBookings, selectedId]);

  const selectedNumericId = selectedId ? Number(selectedId) : null;

  const detailQuery = useQuery({
    queryKey: ["myBooking", selectedNumericId],
    queryFn: () => getMyBooking(selectedNumericId!),
    enabled: selectedNumericId !== null && !Number.isNaN(selectedNumericId),
  });

  const activeBooking = useMemo(() => {
    if (!detailQuery.data) {
      return listBookings.find((b) => b.id === selectedId) ?? null;
    }
    return mapAccountBookingToProfile(detailQuery.data, contactEmail);
  }, [detailQuery.data, listBookings, selectedId, contactEmail]);
  useEffect(() => {
    setLoading(listQuery.isLoading || detailQuery.isFetching);
  }, [listQuery.isLoading, detailQuery.isFetching, setLoading]);

  useEffect(() => {
    if (!listQuery.isError) return;
    const apiMessage = (listQuery.error as AxiosError<{ message: string }>)?.response?.data?.message;
    let message = DEFAULT_MESSAGE;
    if (typeof apiMessage === "string") message = apiMessage;
    else if (Array.isArray(apiMessage) && apiMessage[0]) message = String(apiMessage[0]);
    showNotification(message, NOTI_ERROR);
  }, [listQuery.isError, listQuery.error, showNotification]);

  useEffect(() => {
    if (!detailQuery.isError) return;
    const apiMessage = (detailQuery.error as AxiosError<{ message: string }>)?.response?.data?.message;
    let message = DEFAULT_MESSAGE;
    if (typeof apiMessage === "string") message = apiMessage;
    else if (Array.isArray(apiMessage) && apiMessage[0]) message = String(apiMessage[0]);
    showNotification(message, NOTI_ERROR);
  }, [detailQuery.isError, detailQuery.error, showNotification]);

  const updateMutation = useMutation({
    mutationFn: async ({
      holdCode,
      values,
    }: {
      holdCode: string;
      values: Partial<ProfileBooking>;
    }) => {
      const merged = {
        ...activeBooking!,
        ...values,
      };
      return updateHoldPassenger(holdCode, toPassengerPayload(merged));
    },
    onSuccess: () => {
      showNotification(SUCCESS_MESSAGE, NOTI_SUCCESS);
      void queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      if (selectedNumericId !== null) {
        void queryClient.invalidateQueries({
          queryKey: ["myBooking", selectedNumericId],
        });
      }
    },
    onError: (error) => {
      let message = DEFAULT_MESSAGE;
      if (isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        if (typeof apiMessage === "string") message = apiMessage;
        else if (Array.isArray(apiMessage) && apiMessage[0]) message = String(apiMessage[0]);
      }
      showNotification(message, NOTI_ERROR);
    },
  });

  const handleSave = (values: Partial<ProfileBooking>) => {
    if (!activeBooking?.canEdit) return;
    updateMutation.mutate({
      holdCode: activeBooking.holdCode,
      values,
    });
  };

  const handleContactOperator = (operatorCode: string, operatorName: string, operatorUserId?: number) => {
    const params = new URLSearchParams({
      operator: operatorCode,
      name: operatorName,
    });
    if (operatorUserId) {
      params.set("userId", operatorUserId.toString());
    }
    navigate(`/chat?${params.toString()}`);
  };

  const refundMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const numericId = parseInt(bookingId, 10);
      return requestRefund(numericId);
    },
    onSuccess: (data) => {
      showNotification(data.message || "Yêu cầu hoàn tiền đã được gửi thành công!", NOTI_SUCCESS);
      void queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      if (selectedNumericId !== null) {
        void queryClient.invalidateQueries({
          queryKey: ["myBooking", selectedNumericId],
        });
      }
    },
    onError: (error) => {
      let message = DEFAULT_MESSAGE;
      if (isAxiosError(error)) {
        const apiMessage = error.response?.data?.message;
        if (typeof apiMessage === "string") message = apiMessage;
        else if (Array.isArray(apiMessage) && apiMessage[0]) message = String(apiMessage[0]);
      }
      showNotification(message, NOTI_ERROR);
    },
  });

  const handleRequestRefund = (bookingId: string) => {
    refundMutation.mutate(bookingId);
  };

  const isListLoading = listQuery.isLoading;
  const isEmpty = !isListLoading && listBookings.length === 0;

  return (
    <div className="profile-ticket">
      <div className="profile-ticket__header">
        <div className="pt-header__text">
          <h2 className="pt-header__title">Vé đã đặt</h2>
          <p className="pt-header__desc">
            Xem và cập nhật thông tin cho từng chuyến xe.
          </p>
        </div>
        <span className="pt-header__count">
          {listQuery.data?.total ?? listBookings.length} vé
        </span>
      </div>

      <div className="profile-ticket__layout">
        <aside className="profile-ticket__list">
          {isListLoading ? (
            <div className="profile-ticket__list-loading">
              <Spin />
            </div>
          ) : isEmpty ? (
            <Empty description="Chưa có vé nào" />
          ) : (
            listBookings.map((b) => (
              <BookingListItem
                key={b.id}
                booking={b}
                isActive={b.id === selectedId}
                onClick={() => setSelectedId(b.id)}
              />
            ))
          )}
        </aside>

        <main className="profile-ticket__detail-pane">
          {detailQuery.isLoading && selectedId ? (
            <div className="profile-ticket__detail-loading">
              <Spin />
            </div>
          ) : activeBooking ? (
            <BookingDetail
              booking={activeBooking}
              saving={updateMutation.isPending}
              onSave={handleSave}
              onContactOperator={handleContactOperator}
              onRequestRefund={handleRequestRefund}
              refundLoading={refundMutation.isPending}
            />
          ) : (
            <Empty description="Chọn một vé để xem chi tiết" />
          )}
        </main>
      </div>
    </div>
  );
};
