import { Button, Tag } from "antd";
import { useUser } from "@/common/contexts/UserContext";
import { SUMMARY_STATS } from "../../../../common/constants/profile.constant";
import { formatCurrency, formatDate } from "../../../../common/utils/profile.utils";
import { StatCard, ActivityItem, MemberCard, RemindersCard } from "./components";
import "./style.scss";

type ProfileLikeUser = ReturnType<typeof useUser>["user"] & {
  ticketCount?: number;
  bookingCount?: number;
  totalPaid?: number;
  rank?: string;
  spentAmount?: number;
  nextRank?: string;
  nextRankThreshold?: number;
  rankProgressPercent?: number;
  lastBookingAt?: string;
  pendingTicketCount?: number;
  refundCount?: number;
};

export const ProfileSummary = ({ onEdit }: { onEdit?: () => void }) => {
  const { user } = useUser();
  const profile = user as ProfileLikeUser;
  const rank = profile.rank ?? "Chưa xếp hạng";
  const nextRank = profile.nextRank;
  const progress = profile.rankProgressPercent ?? 0;
  const memberSince = profile.lastBookingAt
    ? formatDate(profile.lastBookingAt)
    : "Chưa có dữ liệu";

  return (
    <div className="profile-summary">
      <div className="ps-hero">
        <div className="ps-hero__avatar">
          {profile?.userName?.charAt(0).toUpperCase() || "N"}
        </div>
        <div className="ps-hero__info">
          <div className="ps-hero__greeting">Tổng quan tài khoản</div>
          <div className="ps-hero__name">{profile?.userName}</div>
          <div className="ps-hero__meta">
            <Tag
              className="ps-hero__badge"
              icon={<i className="ti ti-star-filled" aria-hidden="true" />}
              bordered={false}
            >
              Thành viên {rank}
            </Tag>
            <span className="ps-hero__since">
              {nextRank ? `Tiến độ lên ${nextRank} ${progress}%` : memberSince}
            </span>
          </div>
        </div>
        <Button
          className="ps-hero__btn"
          icon={<i className="ti ti-edit" aria-hidden="true" />}
          onClick={onEdit}
          size="large"
        >
          Cập nhật hồ sơ
        </Button>
      </div>

      <div className="ps-stats">
        {SUMMARY_STATS.map((s) => (
          <StatCard key={s.id} stat={s} user={profile} />
        ))}
      </div>

      <div className="ps-activity">
        <div className="ps-activity__hd">
          <div className="ps-activity__title">
            <i className="ti ti-history" aria-hidden="true" />
            Hoạt động gần đây
          </div>
        </div>

        <div className="ps-activity__grid">
          <div className="ps-trip-list">
            <ActivityItem
              icon="ti-ticket"
              title={`Đơn đặt gần nhất${profile.lastBookingAt ? ` · ${formatDate(profile.lastBookingAt)}` : ""}`}
              meta={`Tổng đã thanh toán: ${formatCurrency(profile.spentAmount ?? profile.totalPaid)} VND`}
              status={profile.pendingTicketCount ? "Đang xử lý" : "Hoàn tất"}
            />
            <ActivityItem
              icon="ti-bus"
              title={`Số chuyến đã đặt: ${formatCurrency(profile.bookingCount)}`}
              meta={`Số vé: ${formatCurrency(profile.ticketCount)}`}
              status={profile.refundCount ? "Có hoàn tiền" : "Bình thường"}
            />
          </div>

          <div className="ps-sidebar">
            <MemberCard user={profile} />
            <RemindersCard user={profile} />
          </div>
        </div>
      </div>
    </div>
  );
};
