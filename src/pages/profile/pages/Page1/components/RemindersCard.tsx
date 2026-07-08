import { formatDate } from "../../../../../common/utils/profile.utils";
import "./RemindersCard.scss";

type ProfileLikeUser = {
  pendingTicketCount?: number;
  lastBookingAt?: string;
  refundCount?: number;
};

interface RemindersCardProps {
  user: ProfileLikeUser;
}

export const RemindersCard = ({ user }: RemindersCardProps) => {
  const reminders = [
    user.pendingTicketCount
      ? `Có ${user.pendingTicketCount} vé đang chờ thanh toán`
      : "Không có vé chờ thanh toán",
    user.lastBookingAt
      ? `Đơn gần nhất: ${formatDate(user.lastBookingAt)}`
      : "Chưa có đơn gần nhất",
    user.refundCount
      ? `Đã xử lý ${user.refundCount} yêu cầu hoàn tiền`
      : "Chưa có yêu cầu hoàn tiền",
  ];

  return (
    <div className="ps-reminders">
      <div className="ps-reminders__hd">
        <i className="ti ti-bell-ringing" aria-hidden="true" />
        <span>Lời nhắc</span>
        <span className="ps-reminders__count">{reminders.length}</span>
      </div>
      {reminders.map((text) => (
        <div key={text} className="ps-reminders__item">
          <span className="ps-reminders__dot" />
          <span className="ps-reminders__text">{text}</span>
          <i
            className="ti ti-chevron-right ps-reminders__arrow"
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  );
};
