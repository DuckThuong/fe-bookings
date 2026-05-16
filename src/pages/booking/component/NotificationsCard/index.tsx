import type { NotifItem } from "../../types/confirm.types";

interface NotificationsCardProps {
  notifications: NotifItem[];
}

const NotificationsCard = ({ notifications }: NotificationsCardProps) => (
  <div className="notif-card">
    <div className="notif-card__hd">
      <i className="ti ti-bell" aria-hidden="true" />
      <span>Thông báo</span>
    </div>

    {notifications?.map((item) => (
      <div key={item.id} className="notif-card__item">
        <div
          className={`notif-card__icon notif-card__icon--${item.colorClass}`}
        >
          <i className={`ti ${item.icon}`} aria-hidden="true" />
        </div>
        <div>
          <div className="notif-card__item-title">{item.title}</div>
          <div className="notif-card__item-desc">{item.desc}</div>
        </div>
      </div>
    ))}
  </div>
);

export default NotificationsCard;
