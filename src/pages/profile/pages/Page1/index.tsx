import { Button, Progress, Tag } from "antd";
import "./style.scss";

// ─── Static data (thay bằng props / API call thật) ────────
const SUMMARY_STATS = [
  {
    id: "trips",
    icon: "ti-bus",
    label: "Số chuyến đã đặt",
    value: "14",
    sub: "chuyến xe",
  },
  {
    id: "points",
    icon: "ti-coin",
    label: "Điểm thưởng",
    value: "2.560",
    sub: "điểm tích lũy",
  },
  {
    id: "visits",
    icon: "ti-eye",
    label: "Lượt truy cập",
    value: "1.248",
    sub: "tổng lượt",
  },
];

const RECENT_TRIPS = [
  {
    id: "trip-1",
    icon: "ti-bus",
    title: "Hà Nội → Sapa",
    date: "12 Tháng 5, 2026",
    note: "Xe giường nằm, 2 vé",
    status: "done" as const,
    statusLabel: "Hoàn thành",
  },
  {
    id: "trip-2",
    icon: "ti-car",
    title: "Hồ Chí Minh → Đà Lạt",
    date: "24 Tháng 5, 2026",
    note: "Xe limousine, 1 vé",
    status: "upcoming" as const,
    statusLabel: "Sắp tới",
  },
];

const REMINDERS = [
  "Hoàn tất thông tin thanh toán",
  "Kiểm tra lại chuyến đi sắp tới",
  "Nhận ưu đãi khi đặt tiếp",
];

const MEMBER_PROGRESS = 68;

// ─── Sub-components ───────────────────────────────────────

const StatCard = ({ stat }: { stat: (typeof SUMMARY_STATS)[number] }) => (
  <div className="ps-stat">
    <div className="ps-stat__icon">
      <i className={`ti ${stat.icon}`} aria-hidden="true" />
    </div>
    <div className="ps-stat__label">{stat.label}</div>
    <div className="ps-stat__value">{stat.value}</div>
    <div className="ps-stat__sub">{stat.sub}</div>
  </div>
);

const TripItem = ({ trip }: { trip: (typeof RECENT_TRIPS)[number] }) => (
  <div className="ps-trip">
    <div className="ps-trip__icon">
      <i className={`ti ${trip.icon}`} aria-hidden="true" />
    </div>
    <div className="ps-trip__body">
      <div className="ps-trip__title">{trip.title}</div>
      <div className="ps-trip__meta">
        <span className="ps-trip__date">
          <i className="ti ti-calendar" aria-hidden="true" />
          {trip.date}
        </span>
        <span className="ps-trip__sep" />
        <span className="ps-trip__note">{trip.note}</span>
      </div>
    </div>
    <Tag
      className={`ps-trip__tag ps-trip__tag--${trip.status}`}
      bordered={false}
    >
      {trip.statusLabel}
    </Tag>
    <i className="ti ti-chevron-right ps-trip__chevron" aria-hidden="true" />
  </div>
);

const MemberCard = () => (
  <div className="ps-member">
    <div className="ps-member__top">
      <div className="ps-member__icon">
        <i className="ti ti-crown" aria-hidden="true" />
      </div>
      <div className="ps-member__info">
        <div className="ps-member__tier">Hạng Gold</div>
        <div className="ps-member__next">Tiến độ lên Kim Cương</div>
      </div>
      <div className="ps-member__pct">{MEMBER_PROGRESS}%</div>
    </div>
    <div className="ps-member__body">
      <Progress
        percent={MEMBER_PROGRESS}
        showInfo={false}
        strokeColor={{ from: "#f5a623", to: "#fdc96a" }}
        trailColor="var(--color-background-secondary)"
        size={["100%", 6]}
        className="ps-member__progress"
      />
      <div className="ps-member__labels">
        <span>Gold</span>
        <span>Còn {100 - MEMBER_PROGRESS}% nữa → Kim Cương</span>
      </div>
    </div>
  </div>
);

const RemindersCard = () => (
  <div className="ps-reminders">
    <div className="ps-reminders__hd">
      <i className="ti ti-bell-ringing" aria-hidden="true" />
      <span>Lời nhắc</span>
      <span className="ps-reminders__count">{REMINDERS.length}</span>
    </div>
    {REMINDERS.map((text) => (
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

// ─── Main component ───────────────────────────────────────
export const ProfileSummary = ({ onEdit }: { onEdit?: () => void }) => (
  <div className="profile-summary">
    {/* Hero banner */}
    <div className="ps-hero">
      <div className="ps-hero__avatar">NA</div>
      <div className="ps-hero__info">
        <div className="ps-hero__greeting">Tổng quan tài khoản</div>
        <div className="ps-hero__name">Nguyễn Văn An</div>
        <div className="ps-hero__meta">
          <Tag
            className="ps-hero__badge"
            icon={<i className="ti ti-star-filled" aria-hidden="true" />}
            bordered={false}
          >
            Thành viên Gold
          </Tag>
          <span className="ps-hero__since">Tham gia từ tháng 1, 2025</span>
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

    {/* Stat cards */}
    <div className="ps-stats">
      {SUMMARY_STATS.map((s) => (
        <StatCard key={s.id} stat={s} />
      ))}
    </div>

    {/* Activity section */}
    <div className="ps-activity">
      <div className="ps-activity__hd">
        <div className="ps-activity__title">
          <i className="ti ti-history" aria-hidden="true" />
          Hoạt động gần đây
        </div>
        <Button
          type="link"
          className="ps-activity__view-all"
          icon={<i className="ti ti-arrow-right" aria-hidden="true" />}
          iconPosition="end"
        >
          Xem tất cả
        </Button>
      </div>

      <div className="ps-activity__grid">
        {/* Trip list */}
        <div className="ps-trip-list">
          {RECENT_TRIPS.map((t) => (
            <TripItem key={t.id} trip={t} />
          ))}
        </div>

        {/* Sidebar */}
        <div className="ps-sidebar">
          <MemberCard />
          <RemindersCard />
        </div>
      </div>
    </div>
  </div>
);
