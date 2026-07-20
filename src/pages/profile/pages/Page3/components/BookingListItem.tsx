import { useBookingStatuses } from "@/common/hooks/useBookingStatuses";
import type { ProfileBooking } from "@/pages/profile/utils/mapProfileBooking";
import {
  CalendarOutlined
} from "@ant-design/icons";
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
  const { getBookingStatusMeta } = useBookingStatuses();
  const statusMeta = getBookingStatusMeta(booking.status);
  const cfg = statusMeta ?? { color: "#64748b", bg: "#f1f5f9", dot: "#94a3b8", label: booking.status };
  
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
          {cfg.label || booking.status}
        </span>
      </div>

      <div className="pt-list-item__meta">
        <span>
          <CalendarOutlined /> {booking.timeTicket}
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
