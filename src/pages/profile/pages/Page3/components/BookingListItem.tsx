import {
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  type ProfileBooking,
  STATUS_CONFIG,
} from "../../../../../common/constants/profile.constant";
import "./BookingListItem.scss";

interface BookingListItemProps {
  booking: ProfileBooking;
  isActive: boolean;
  onClick: () => void;
}

export const BookingListItem = ({
  booking,
  isActive,
  onClick,
}: BookingListItemProps) => {
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
