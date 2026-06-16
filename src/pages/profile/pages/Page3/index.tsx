import { getMyBooking, listMyBookings } from "@/api/configs/account.config";
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
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Empty, Form, Input, Select, Spin } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  mapAccountBookingToProfile,
  type ProfileBooking,
  type ProfileBookingStatus,
  toPassengerPayload,
} from "../../utils/mapProfileBooking";
import { TicketStatusTracker } from "./TicketStatusTracker";
import "./style.scss";

const STATUS_CONFIG: Record<
  ProfileBookingStatus,
  { color: string; bg: string; dot: string }
> = {
  "Đã xác nhận": { color: "#15803d", bg: "#dcfce7", dot: "#22c55e" },
  "Chờ khởi hành": { color: "#854d0e", bg: "#fef9c3", dot: "#eab308" },
  "Chờ xác nhận": { color: "#1d4ed8", bg: "#dbeafe", dot: "#3b82f6" },
  "Chưa thanh toán": { color: "#9a3412", bg: "#ffedd5", dot: "#f97316" },
  "Đã hủy": { color: "#991b1b", bg: "#fee2e2", dot: "#ef4444" },
};

const PICKUP_OPTIONS = [
  { value: "mydinh", label: "Bến xe Mỹ Đình" },
  { value: "giapbat", label: "Bến xe Giáp Bát" },
  { value: "nuocngam", label: "Bến xe Nước Ngầm" },
];

const DROPOFF_OPTIONS = [
  { value: "mienDong", label: "Bến xe Miền Đông" },
  { value: "mienTay", label: "Bến xe Miền Tây" },
  { value: "binhTrieu", label: "Bến xe Bình Triệu" },
];

const resolveApiMessage = (error: unknown) => {
  if (!isAxiosError(error)) return DEFAULT_MESSAGE;
  const apiMessage = error.response?.data?.message;
  if (typeof apiMessage === "string") return apiMessage;
  if (Array.isArray(apiMessage) && apiMessage[0]) return String(apiMessage[0]);
  return DEFAULT_MESSAGE;
};

const BookingListItem = ({
  booking,
  isActive,
  onClick,
}: {
  booking: ProfileBooking;
  isActive: boolean;
  onClick: () => void;
}) => {
  const cfg = STATUS_CONFIG[booking.status];

  return (
    <button
      type="button"
      className={`pt-list-item${isActive ? " pt-list-item--active" : ""}`}
      onClick={onClick}
    >
      <div className="pt-list-item__top">
        <span className="pt-list-item__route">{booking.route}</span>
        <span
          className="pt-list-item__status"
          style={{ color: cfg.color, background: cfg.bg }}
        >
          <span className="pt-list-item__dot" style={{ background: cfg.dot }} />
          {booking.status}
        </span>
      </div>

      <div className="pt-list-item__meta">
        <span>
          <CalendarOutlined /> {booking.date} · {booking.time}
        </span>
        <span className="pt-list-item__sep" />
        <span>Ghế {booking.seat}</span>
      </div>

      <div className="pt-list-item__code">
        <span>#{booking.bookingCode}</span>
        <span className="pt-list-item__arrow">›</span>
      </div>
    </button>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="pt-detail-row">
    <span className="pt-detail-row__label">{label}</span>
    <span className="pt-detail-row__value">{value}</span>
  </div>
);

const BookingDetail = ({
  booking,
  saving,
  onSave,
}: {
  booking: ProfileBooking;
  saving: boolean;
  onSave: (values: Partial<ProfileBooking>) => void;
}) => {
  const [form] = Form.useForm();
  const cfg = STATUS_CONFIG[booking.status];
  const locked = !booking.canEdit;

  useEffect(() => {
    form.setFieldsValue({
      passengerName: booking.passengerName,
      contactPhone: booking.contactPhone,
      contactEmail: booking.contactEmail,
      pickupValue: booking.pickupValue,
      dropoffValue: booking.dropoffValue,
      note: booking.note,
    });
  }, [booking, form]);

  const handleFinish = (values: {
    passengerName: string;
    contactPhone: string;
    contactEmail?: string;
    pickupValue: string;
    dropoffValue: string;
    note?: string;
  }) => {
    onSave({
      passengerName: values.passengerName,
      contactPhone: values.contactPhone,
      contactEmail: values.contactEmail ?? booking.contactEmail,
      pickupValue: values.pickupValue,
      dropoffValue: values.dropoffValue,
      note: values.note ?? "",
    });
  };

  return (
    <div className="pt-detail">
      <div className="pt-ticket-hero">
        <div className="pt-ticket-hero__left">
          <p className="pt-ticket-hero__code">#{booking.bookingCode}</p>
          <h3 className="pt-ticket-hero__route">{booking.route}</h3>
          <div className="pt-ticket-hero__time">
            <ClockCircleOutlined /> {booking.date} · {booking.time}
          </div>
        </div>

        <span
          className="pt-ticket-hero__status"
          style={{ color: cfg.color, background: cfg.bg }}
        >
          <span className="pt-list-item__dot" style={{ background: cfg.dot }} />
          {booking.status}
        </span>
      </div>

      <div className="pt-info-card">
        <p className="pt-card-title">
          <FileTextOutlined /> Chi tiết chuyến
        </p>
        <div className="pt-info-grid">
          <DetailRow label="Hành khách" value={booking.passengerName} />
          <DetailRow label="Số ghế" value={booking.seat} />
          <DetailRow label="Điểm lên xe" value={booking.pickup} />
          <DetailRow label="Điểm xuống xe" value={booking.dropoff} />
          <DetailRow label="Phương thức TT" value={booking.paymentMethod} />
          <DetailRow label="Liên hệ" value={booking.contactPhone} />
        </div>

        {booking.note && (
          <div className="pt-info-note">
            <span className="pt-info-note__icon">📝</span>
            <span>{booking.note}</span>
          </div>
        )}
      </div>

      <TicketStatusTracker booking={booking} />

      <div className="pt-form-card">
        <p className="pt-card-title">
          <UserOutlined /> Cập nhật thông tin
        </p>

        {locked ? (
          booking.status === "Đã xác nhận" || booking.status === "Chờ khởi hành" ? null : (
            <div className="pt-locked-notice">
              <SafetyOutlined className="pt-locked-notice__icon" />
              <span>
                {booking.status === "Chờ xác nhận"
                  ? "Đơn đang chờ nhà xe xác nhận — không thể chỉnh sửa."
                  : booking.status === "Đã hủy"
                    ? "Đơn đặt vé đã bị hủy — không thể chỉnh sửa."
                    : "Chỉ có thể chỉnh sửa khi đơn đang giữ chỗ và chưa hết hạn."}
              </span>
            </div>
          )
        ) : (
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <div className="pt-form-grid">
              <Form.Item
                label="Tên hành khách"
                name="passengerName"
                rules={[{ required: true, message: "Nhập tên hành khách" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn An" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="contactPhone"
                rules={[
                  { required: true, message: "Nhập số điện thoại" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Số điện thoại phải gồm 10 chữ số",
                  },
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="0987654321" />
              </Form.Item>

              <Form.Item
                label="Email liên hệ"
                name="contactEmail"
                rules={[{ type: "email", message: "Email không hợp lệ" }]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="example@domain.com"
                />
              </Form.Item>

              <Form.Item
                label="Điểm lên xe"
                name="pickupValue"
                rules={[{ required: true, message: "Chọn điểm lên xe" }]}
              >
                <Select
                  options={PICKUP_OPTIONS}
                  placeholder="Chọn điểm lên xe"
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Điểm xuống xe"
              name="dropoffValue"
              rules={[{ required: true, message: "Chọn điểm xuống xe" }]}
            >
              <Select
                options={DROPOFF_OPTIONS}
                placeholder="Chọn điểm xuống xe"
              />
            </Form.Item>

            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea
                rows={3}
                placeholder="Ưu tiên ghế cửa sổ, cần hỗ trợ hành lý..."
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="pt-save-btn"
                loading={saving}
              >
                Lưu cập nhật
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export const ProfileTicket = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();
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
    showNotification(resolveApiMessage(listQuery.error), NOTI_ERROR);
  }, [listQuery.isError, listQuery.error, showNotification]);

  useEffect(() => {
    if (!detailQuery.isError) return;
    showNotification(resolveApiMessage(detailQuery.error), NOTI_ERROR);
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
      showNotification(resolveApiMessage(error), NOTI_ERROR);
    },
  });

  const handleSave = (values: Partial<ProfileBooking>) => {
    if (!activeBooking?.canEdit) return;
    updateMutation.mutate({
      holdCode: activeBooking.holdCode,
      values,
    });
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
            />
          ) : (
            <Empty description="Chọn một vé để xem chi tiết" />
          )}
        </main>
      </div>
    </div>
  );
};
