import { Badge, Avatar, Dropdown, Menu } from "antd";
import type { MenuProps } from "antd";
import { Logo } from "@/components/Logo";
import profileIcn from "@/assets/icons/profile.svg";
import tripsIcn from "@/assets/icons/trip.svg";
import settingsIcn from "@/assets/icons/setting.svg";
import logoutIcn from "@/assets/icons/logout.svg";
import bellIcn from "@/assets/icons/bell.svg";
import chevronDownIcn from "@/assets/icons/chevron-down.svg";

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
    icon: <img src={profileIcn} alt="Profile" width={14} height={14} />,
  },
  {
    key: "trips",
    label: "Chuyến đi của tôi",
    icon: <img src={tripsIcn} alt="Trips" width={14} height={14} />,
  },
  {
    key: "settings",
    label: "Cài đặt",
    icon: <img src={settingsIcn} alt="Settings" width={14} height={14} />,
  },
  { type: "divider" },
  {
    key: "logout",
    label: "Đăng xuất",
    danger: true,
    icon: <img src={logoutIcn} alt="Logout" width={14} height={14} />,
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
              <img src={bellIcn} alt="Bell" width={20} height={20} />
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
              <img
                src={chevronDownIcn}
                alt="Chevron Down"
                width={10}
                height={10}
              />
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};
