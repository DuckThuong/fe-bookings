import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ROUTER_PATH } from "@/routers/Route";
import "./style.scss";
import { HomeHeader } from "@/components/TopBar";
// ─── Types ───────────────────────────────────────────────────────────────────

export type NotifType =
  | "ticket"
  | "promo"
  | "system"
  | "cancel"
  | "payment"
  | "update";

export type NotifGroup = "today" | "yesterday" | "week";

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  sub: string;
  badge: string;
  badgeClass: "blue" | "green" | "amber" | "red" | "purple";
  link?: string;
  linkHref?: string;
  time: string;
  group: NotifGroup;
  unread: boolean;
}

type FilterKey = "all" | "unread" | "ticket" | "promo" | "system";

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_NOTIFS: Notification[] = [
  {
    id: "1",
    type: "ticket",
    title: "Vé xác nhận – Hà Nội → Đà Nẵng",
    sub: "Chuyến 14:30 ngày 18/05 · Nhà xe Phương Trang · Ghế 12A",
    badge: "Xác nhận",
    badgeClass: "blue",
    link: "Xem vé",
    linkHref: ROUTER_PATH.PROFILE,
    time: "5 phút trước",
    group: "today",
    unread: true,
  },
  {
    id: "2",
    type: "payment",
    title: "Thanh toán thành công",
    sub: "Đơn #BG-20480 · 320.000 VNĐ · Thẻ Visa *4242",
    badge: "Hoàn tất",
    badgeClass: "green",
    link: "Xem đơn",
    time: "1 giờ trước",
    group: "today",
    unread: true,
  },
  {
    id: "3",
    type: "promo",
    title: "Flash sale – Giảm 35% mọi tuyến",
    sub: "Chỉ còn 4 giờ! Áp dụng mã FLASH35 cho tuyến Hà Nội – TP.HCM",
    badge: "Hot",
    badgeClass: "red",
    link: "Đặt ngay",
    linkHref: ROUTER_PATH.TRIP,
    time: "3 giờ trước",
    group: "today",
    unread: true,
  },
  {
    id: "4",
    type: "ticket",
    title: "Nhắc nhở khởi hành – ngày mai",
    sub: "Chuyến Hà Nội → Hải Phòng · 07:00 sáng · Bến xe Giáp Bát",
    badge: "Sắp đến",
    badgeClass: "amber",
    link: "Xem vé",
    time: "6 giờ trước",
    group: "today",
    unread: false,
  },
  {
    id: "5",
    type: "cancel",
    title: "Hoàn tiền đã xử lý",
    sub: "180.000 VNĐ hoàn về VNPay ví của bạn · Đơn #BG-20399",
    badge: "Hoàn tiền",
    badgeClass: "red",
    link: "Chi tiết",
    time: "Hôm qua 14:22",
    group: "yesterday",
    unread: true,
  },
  {
    id: "6",
    type: "promo",
    title: "Ưu đãi thành viên – Giảm thêm 10%",
    sub: "Đặc quyền tài khoản thường. Áp dụng tuyến liên tỉnh đến 31/05",
    badge: "Thành viên",
    badgeClass: "purple",
    link: "Khám phá",
    linkHref: ROUTER_PATH.PROMOS,
    time: "Hôm qua 09:05",
    group: "yesterday",
    unread: false,
  },
  {
    id: "7",
    type: "system",
    title: "Cập nhật ứng dụng mới – v2.4.1",
    sub: "Trải nghiệm mua vé nhanh hơn, sửa lỗi hiển thị sơ đồ ghế",
    badge: "Cập nhật",
    badgeClass: "purple",
    time: "3 ngày trước",
    group: "week",
    unread: false,
  },
  {
    id: "8",
    type: "ticket",
    title: "Đánh giá chuyến đi của bạn",
    sub: "Nhà xe Hùng Cường · Hà Nội → Nghệ An · Hãy chia sẻ trải nghiệm",
    badge: "Mời đánh giá",
    badgeClass: "amber",
    link: "Đánh giá ngay",
    time: "5 ngày trước",
    group: "week",
    unread: false,
  },
];

const ICON_MAP: Record<NotifType, string> = {
  ticket: "🎫",
  promo: "🏷️",
  system: "⚙️",
  cancel: "🔄",
  payment: "💳",
  update: "🔔",
};

const GROUP_LABELS: Record<NotifGroup, string> = {
  today: "Hôm nay",
  yesterday: "Hôm qua",
  week: "Tuần trước",
};

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "unread", label: "Chưa đọc" },
  { key: "ticket", label: "Vé & đặt chỗ" },
  { key: "promo", label: "Khuyến mãi" },
  { key: "system", label: "Hệ thống" },
];

// ─── Settings toggle row ──────────────────────────────────────────────────────

interface SettingRowProps {
  icon: string;
  label: string;
  defaultOn?: boolean;
}
const SettingRow = ({ icon, label, defaultOn = true }: SettingRowProps) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="notif-setting-item">
      <span className="notif-setting-label">
        <span className="notif-setting-emoji">{icon}</span>
        {label}
      </span>
      <button
        className={`notif-toggle${on ? " on" : ""}`}
        onClick={() => setOn((v) => !v)}
        aria-label={`${label} ${on ? "bật" : "tắt"}`}
      />
    </div>
  );
};

// ─── NotificationsPage ────────────────────────────────────────────────────────

export const NotificationsPage = () => {
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Derived stats
  const unreadCount = notifs.filter((n) => n.unread).length;
  const todayCount = notifs.filter((n) => n.group === "today").length;

  // Filter counts
  const filterCounts: Record<FilterKey, number> = {
    all: notifs.length,
    unread: unreadCount,
    ticket: notifs.filter((n) => n.type === "ticket" || n.type === "cancel")
      .length,
    promo: notifs.filter((n) => n.type === "promo").length,
    system: notifs.filter(
      (n) => n.type === "system" || n.type === "update" || n.type === "payment",
    ).length,
  };

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return notifs.filter((n) => {
      if (filter === "unread" && !n.unread) return false;
      if (filter === "ticket" && n.type !== "ticket" && n.type !== "cancel")
        return false;
      if (filter === "promo" && n.type !== "promo") return false;
      if (
        filter === "system" &&
        n.type !== "system" &&
        n.type !== "update" &&
        n.type !== "payment"
      )
        return false;
      if (
        q &&
        !n.title.toLowerCase().includes(q) &&
        !n.sub.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [notifs, filter, search]);

  const markRead = (id: string) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );

  const deleteItem = (id: string) =>
    setNotifs((prev) => prev.filter((n) => n.id !== id));

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <>
      <HomeHeader />
      <div className="notif-page">
        <div className="notif-page__head">
          <nav className="notif-page__breadcrumb" aria-label="Breadcrumb">
            <Link to={ROUTER_PATH.HOME}>Trang chủ</Link>
            <span>/</span>
            <span>Thông báo</span>
          </nav>

          <div className="notif-page__title-row">
            <h1 className="notif-page__title">Thông báo</h1>
            <div className="notif-page__actions">
              <button
                className="notif-btn notif-btn--ghost"
                onClick={() => setSettingsOpen((v) => !v)}
              >
                ⚙️ Cài đặt
              </button>
              {unreadCount > 0 && (
                <button
                  className="notif-btn notif-btn--primary"
                  onClick={markAllRead}
                >
                  ✓ Đọc tất cả
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="notif-stats">
          <div className="notif-stat-card">
            <div className="notif-stat-card__icon notif-stat-card__icon--all">
              🔔
            </div>
            <div>
              <div className="notif-stat-card__num">{notifs.length}</div>
              <div className="notif-stat-card__label">Tổng thông báo</div>
            </div>
          </div>
          <div className="notif-stat-card">
            <div className="notif-stat-card__icon notif-stat-card__icon--unread">
              📬
            </div>
            <div>
              <div className="notif-stat-card__num notif-stat-card__num--amber">
                {unreadCount}
              </div>
              <div className="notif-stat-card__label">Chưa đọc</div>
            </div>
          </div>
          <div className="notif-stat-card">
            <div className="notif-stat-card__icon notif-stat-card__icon--today">
              📅
            </div>
            <div>
              <div className="notif-stat-card__num notif-stat-card__num--green">
                {todayCount}
              </div>
              <div className="notif-stat-card__label">Hôm nay</div>
            </div>
          </div>
        </div>

        {/* ── Settings panel ── */}
        {settingsOpen && (
          <div className="notif-settings">
            <div className="notif-settings__head">
              <span>⚙️ Tuỳ chỉnh thông báo</span>
              <button
                className="notif-settings__close"
                onClick={() => setSettingsOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="notif-settings__body">
              <SettingRow icon="🎫" label="Vé & đặt chỗ" defaultOn />
              <SettingRow icon="🏷️" label="Khuyến mãi" defaultOn />
              <SettingRow icon="💳" label="Thanh toán" defaultOn />
              <SettingRow icon="⚙️" label="Hệ thống" />
              <SettingRow icon="📧" label="Email" defaultOn />
              <SettingRow icon="📱" label="Push" />
            </div>
          </div>
        )}

        {/* ── Toolbar ── */}
        <div className="notif-toolbar">
          <div className="notif-filter-tabs" role="tablist">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                className={`notif-tab${filter === f.key ? " active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                <span className="notif-tab__count">{filterCounts[f.key]}</span>
              </button>
            ))}
          </div>

          <div className="notif-search">
            <span className="notif-search__icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm thông báo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── List ── */}
        {filtered.length === 0 ? (
          <div className="notif-empty">
            <div className="notif-empty__icon">🔕</div>
            <p className="notif-empty__title">Không có thông báo</p>
            <p className="notif-empty__sub">
              Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm
            </p>
          </div>
        ) : (
          (["today", "yesterday", "week"] as NotifGroup[]).map((g) => {
            const items = filtered.filter((n) => n.group === g);
            if (!items.length) return null;
            return (
              <div key={g} className="notif-group">
                <div className="notif-group__label">{GROUP_LABELS[g]}</div>
                <div className="notif-list">
                  {items.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-row notif-row--${n.type}${n.unread ? " unread" : ""}`}
                      onClick={() => markRead(n.id)}
                    >
                      {n.unread && <span className="notif-row__dot" />}

                      <div className={`notif-row__icon type-${n.type}`}>
                        {ICON_MAP[n.type]}
                      </div>

                      <div className="notif-row__body">
                        <div className="notif-row__title-row">
                          <span className="notif-row__title">{n.title}</span>
                          <span
                            className={`notif-row__badge badge-${n.badgeClass}`}
                          >
                            {n.badge}
                          </span>
                        </div>
                        <p className="notif-row__sub">{n.sub}</p>
                        <div className="notif-row__meta">
                          <span className="notif-row__time">⏱ {n.time}</span>
                          {n.link && (
                            <a
                              className="notif-row__link"
                              href={n.linkHref ?? "#"}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {n.link} →
                            </a>
                          )}
                        </div>
                      </div>

                      <div
                        className="notif-row__actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {n.unread && (
                          <button
                            className="notif-icon-btn notif-icon-btn--read"
                            title="Đánh dấu đã đọc"
                            onClick={() => markRead(n.id)}
                          >
                            ✓
                          </button>
                        )}
                        <button
                          className="notif-icon-btn notif-icon-btn--del"
                          title="Xoá"
                          onClick={() => deleteItem(n.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};
