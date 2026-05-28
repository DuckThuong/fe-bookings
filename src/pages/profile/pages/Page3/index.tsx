import { useEffect, useMemo, useState } from "react";
import { Alert, Empty, Spin } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useMyBookingQuery, useMyBookingsQuery } from "@/features/account/hooks/useAccountBookings";
import {
  mapAccountBookingToView,
  type ProfileBookingViewModel,
} from "@/features/booking/utils/bookingMappers";
import { getApiErrorMessage } from "@/common/utils/apiError";
import "./style.scss";

type Booking = ProfileBookingViewModel;

const STATUS_CONFIG: Record<
  Booking["status"],
  { color: string; bg: string; dot: string; label: string }
> = {
  Confirmed: {
    color: "#15803d",
    bg: "#dcfce7",
    dot: "#22c55e",
    label: "Da xac nhan",
  },
  Pending: {
    color: "#854d0e",
    bg: "#fef9c3",
    dot: "#eab308",
    label: "Dang xu ly",
  },
  Unpaid: {
    color: "#9a3412",
    bg: "#ffedd5",
    dot: "#f97316",
    label: "Chua thanh toan",
  },
};

const BookingListItem = ({
  booking,
  isActive,
  onClick,
}: {
  booking: Booking;
  isActive: boolean;
  onClick: () => void;
}) => {
  const cfg = STATUS_CONFIG[booking.status];

  return (
    <button
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
          {cfg.label}
        </span>
      </div>

      <div className="pt-list-item__meta">
        <span>
          <CalendarOutlined /> {booking.date} - {booking.time}
        </span>
        <span className="pt-list-item__sep" />
        <span>Ghe {booking.seat}</span>
      </div>

      <div className="pt-list-item__code">
        <span>#{booking.bookingCode}</span>
        <span className="pt-list-item__arrow">&gt;</span>
      </div>
    </button>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="pt-detail-row">
    <span className="pt-detail-row__label">{label}</span>
    <span className="pt-detail-row__value">{value || "-"}</span>
  </div>
);

const BookingDetail = ({ booking }: { booking: Booking }) => {
  const cfg = STATUS_CONFIG[booking.status];

  return (
    <div className="pt-detail">
      <div className="pt-ticket-hero">
        <div className="pt-ticket-hero__left">
          <p className="pt-ticket-hero__code">#{booking.bookingCode}</p>
          <h3 className="pt-ticket-hero__route">{booking.route}</h3>
          <div className="pt-ticket-hero__time">
            <ClockCircleOutlined /> {booking.date} - {booking.time}
          </div>
        </div>

        <span
          className="pt-ticket-hero__status"
          style={{ color: cfg.color, background: cfg.bg }}
        >
          <span className="pt-list-item__dot" style={{ background: cfg.dot }} />
          {cfg.label}
        </span>
      </div>

      <div className="pt-info-card">
        <p className="pt-card-title">
          <FileTextOutlined /> Chi tiet chuyen
        </p>
        <div className="pt-info-grid">
          <DetailRow label="Hanh khach" value={booking.passengerName} />
          <DetailRow label="So ghe" value={booking.seat} />
          <DetailRow label="Diem len xe" value={booking.pickup} />
          <DetailRow label="Diem xuong xe" value={booking.dropoff} />
          <DetailRow label="Phuong thuc TT" value={booking.paymentMethod} />
          <DetailRow label="Lien he" value={booking.contactPhone} />
        </div>

        {booking.note && (
          <div className="pt-info-note">
            <span className="pt-info-note__icon">i</span>
            <span>{booking.note}</span>
          </div>
        )}
      </div>

      <div className="pt-form-card">
        <p className="pt-card-title">
          <SafetyOutlined /> Thong tin dat ve
        </p>
        <div className="pt-locked-notice">
          <SafetyOutlined className="pt-locked-notice__icon" />
          <span>Thong tin nay duoc doc tu he thong dat ve.</span>
        </div>
      </div>
    </div>
  );
};

export const ProfileTicket = () => {
  const bookingsQuery = useMyBookingsQuery({ page: 1, limit: 20 });
  const bookings = useMemo(
    () =>
      bookingsQuery.data?.items.map((booking) =>
        mapAccountBookingToView(booking),
      ) ?? [],
    [bookingsQuery.data?.items],
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedId || !bookings[0]) return;
    setSelectedId(bookings[0].id);
  }, [bookings, selectedId]);

  const detailQuery = useMyBookingQuery(
    selectedId ?? "",
    selectedId !== null,
  );
  const activeBooking =
    detailQuery.data
      ? mapAccountBookingToView(detailQuery.data)
      : bookings.find((booking) => booking.id === selectedId) ?? null;

  return (
    <div className="profile-ticket">
      <div className="profile-ticket__header">
        <div className="pt-header__text">
          <h2 className="pt-header__title">Ve da dat</h2>
          <p className="pt-header__desc">
            Xem thong tin cac chuyen xe da dat cua ban.
          </p>
        </div>
        <span className="pt-header__count">
          {bookingsQuery.data?.total ?? bookings.length} ve
        </span>
      </div>

      {bookingsQuery.isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Spin />
        </div>
      ) : bookingsQuery.error ? (
        <Alert
          type="error"
          showIcon
          message={getApiErrorMessage(bookingsQuery.error)}
        />
      ) : bookings.length === 0 ? (
        <Empty description="Chua co ve nao" />
      ) : (
        <div className="profile-ticket__layout">
          <aside className="profile-ticket__list">
            {bookings.map((booking) => (
              <BookingListItem
                key={booking.id}
                booking={booking}
                isActive={booking.id === selectedId}
                onClick={() => setSelectedId(booking.id)}
              />
            ))}
          </aside>

          <main className="profile-ticket__detail-pane">
            {detailQuery.isFetching && !activeBooking ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: 48,
                }}
              >
                <Spin />
              </div>
            ) : detailQuery.error ? (
              <Alert
                type="error"
                showIcon
                message={getApiErrorMessage(detailQuery.error)}
              />
            ) : activeBooking ? (
              <BookingDetail booking={activeBooking} />
            ) : (
              <Empty description="Chon mot ve de xem chi tiet" />
            )}
          </main>
        </div>
      )}
    </div>
  );
};
