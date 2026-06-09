import { Button, Progress, Tag } from "antd";
import "./style.scss";
import { useUser } from "@/common/contexts/UserContext";

const SUMMARY_STATS = [
  {
    id: "trips",
    icon: "ti-bus",
    label: "Số chuyến đã đặt",
    key: "bookingCount",
    sub: "chuyến xe",
  },
  {
    id: "paid",
    icon: "ti-coin",
    label: "Tổng chi tiêu",
    key: "spentAmount",
    sub: "VND",
  },
  {
    id: "tickets",
    icon: "ti-eye",
    label: "Số vé",
    key: "ticketCount",
    sub: "vé đã phát hành",
  },
] as const;

type ProfileStatKey = (typeof SUMMARY_STATS)[number]["key"];

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

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("vi-VN").format(value ?? 0);

const formatDate = (value?: string) => {
  if (!value) return "Chưa có dữ liệu";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const StatCard = ({
  stat,
  user,
}: {
  stat: (typeof SUMMARY_STATS)[number];
  user: ProfileLikeUser;
}) => {
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

const ActivityItem = ({
  icon,
  title,
  meta,
  status,
}: {
  icon: string;
  title: string;
  meta: string;
  status: string;
}) => (
  <div className="ps-trip">
    <div className="ps-trip__icon">
      <i className={`ti ${icon}`} aria-hidden="true" />
    </div>
    <div className="ps-trip__body">
      <div className="ps-trip__title">{title}</div>
      <div className="ps-trip__meta">
        <span className="ps-trip__note">{meta}</span>
      </div>
    </div>
    <Tag className={`ps-trip__tag ps-trip__tag--${status}`} bordered={false}>
      {status}
    </Tag>
    <i className="ti ti-chevron-right ps-trip__chevron" aria-hidden="true" />
  </div>
);

const MemberCard = ({ user }: { user: ProfileLikeUser }) => {
  const rank = user.rank ?? "Chưa xếp hạng";
  const nextRank = user.nextRank;
  const progress = user.rankProgressPercent ?? 0;

  return (
    <div className="ps-member">
      <div className="ps-member__top">
        <div className="ps-member__icon">
          <i className="ti ti-crown" aria-hidden="true" />
        </div>
        <div className="ps-member__info">
          <div className="ps-member__tier">Hạng {rank}</div>
          <div className="ps-member__next">
            {nextRank ? `Tiến độ lên ${nextRank}` : "Đã đạt hạng cao nhất"}
          </div>
        </div>
        <div className="ps-member__pct">{progress}%</div>
      </div>
      <div className="ps-member__body">
        <Progress
          percent={progress}
          showInfo={false}
          strokeColor={{ from: "#f5a623", to: "#fdc96a" }}
          trailColor="var(--color-background-secondary)"
          size={["100%", 6]}
          className="ps-member__progress"
        />
        <div className="ps-member__labels">
          <span>{rank}</span>
          <span>
            {nextRank
              ? `Còn ${100 - progress}% nữa → ${nextRank}`
              : "Không còn mốc tiếp theo"}
          </span>
        </div>
      </div>
    </div>
  );
};

const RemindersCard = ({ user }: { user: ProfileLikeUser }) => {
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
