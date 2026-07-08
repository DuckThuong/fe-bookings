import { Progress } from "antd";
import { SUMMARY_STATS, type ProfileStatKey } from "../../../../../common/constants/profile.constant";
import { formatCurrency } from "../../../../../common/utils/profile.utils";
import "./StatCard.scss";

type ProfileLikeUser = {
  ticketCount?: number;
  bookingCount?: number;
  totalPaid?: number;
  spentAmount?: number;
};

interface StatCardProps {
  stat: (typeof SUMMARY_STATS)[number];
  user: ProfileLikeUser;
}

export const StatCard = ({ stat, user }: StatCardProps) => {
  const values: Record<ProfileStatKey, string> = {
    bookingCount: formatCurrency(user.bookingCount),
    spentAmount: formatCurrency(user.spentAmount ?? user.totalPaid),
    ticketCount: formatCurrency(user.ticketCount),
  };

  return (
    <div className="ps-stat">
      <div className="ps-stat__icon">
        <i className={`ti ${stat.icon}`} aria-hidden="true" />
      </div>
      <div className="ps-stat__label">{stat.label}</div>
      <div className="ps-stat__value">{values[stat.key]}</div>
      <div className="ps-stat__sub">{stat.sub}</div>
    </div>
  );
};
