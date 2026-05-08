import { Badge, Avatar, Dropdown, Menu } from "antd";
import type { MenuProps } from "antd";
import { Logo } from "@/components/Logo";

interface HomeHeaderProps {
  userName?: string;
  notifCount?: number;
}

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/" },
  { label: "Vé xe", href: "/tickets" },
  { label: "Khuyến mãi", href: "/promos" },
  { label: "Hỗ trợ", href: "/support" },
];

const USER_MENU_ITEMS: MenuProps["items"] = [
  {
    key: "profile",
    label: "Tài khoản của tôi",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" width={14} height={14}>
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M2 14c0-3 2.7-5 6-5s6 2 6 5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "trips",
    label: "Chuyến đi của tôi",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" width={14} height={14}>
        <rect
          x="2"
          y="4"
          width="12"
          height="9"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M5 4V3a3 3 0 016 0v1M5 9h6M5 12h4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "settings",
    label: "Cài đặt",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" width={14} height={14}>
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  { type: "divider" },
  {
    key: "logout",
    label: "Đăng xuất",
    danger: true,
    icon: (
      <svg viewBox="0 0 16 16" fill="none" width={14} height={14}>
        <path
          d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

// ─── Component ───────────────────────────────────────────
export const HomeHeader = ({
  userName = "Khách",
  notifCount = 3,
}: HomeHeaderProps) => {
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    console.log("user menu:", key);
  };

  return (
    <header className="home-header">
      <div className="home-header__inner">
        {/* Logo */}
        <div className="home-header__logo">
          <Logo />
        </div>

        <nav className="home-header__nav">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className={`home-header__nav-link${i === 0 ? " active" : ""}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="home-header__actions">
          {/* Notification bell */}
          <Badge count={notifCount} size="small" color="#f5a623">
            <button className="home-header__icon-btn" aria-label="Thông báo">
              <svg viewBox="0 0 20 20" fill="none" width={20} height={20}>
                <path
                  d="M10 2a6 6 0 00-6 6v2.586l-1.707 1.707A1 1 0 003 14h14a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 14a2 2 0 004 0"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </Badge>

          {/* Avatar dropdown */}
          <Dropdown
            placement="bottomRight"
            trigger={["click"]}
            dropdownRender={() => (
              <Menu
                className="home-header__user-menu"
                items={USER_MENU_ITEMS}
                onClick={handleMenuClick}
              />
            )}
          >
            <button className="home-header__avatar-btn">
              <Avatar size={34} className="home-header__avatar">
                {userName.charAt(0).toUpperCase()}
              </Avatar>
              <span className="home-header__username">{userName}</span>
              <svg
                viewBox="0 0 12 12"
                fill="none"
                width={10}
                height={10}
                className="home-header__chevron"
              >
                <path
                  d="M2 4l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};
