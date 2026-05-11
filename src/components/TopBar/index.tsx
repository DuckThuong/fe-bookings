import { Badge, Avatar, Dropdown, Menu } from "antd";
import type { MenuProps } from "antd";
import { Logo } from "@/components/Logo";
import profileIcn from "@/assets/icons/profile.svg";
import tripsIcn from "@/assets/icons/trip.svg";
import settingsIcn from "@/assets/icons/setting.svg";
import logoutIcn from "@/assets/icons/logout.svg";
import bellIcn from "@/assets/icons/bell.svg";
import chevronDownIcn from "@/assets/icons/chevron-down.svg";
import { ROUTER_PATH } from "@/routers/Route";
import { Link, useLocation } from "react-router-dom";

interface HomeHeaderProps {
  userName?: string;
  notifCount?: number;
}

const NAV_ITEMS = [
  { label: "Trang chủ", href: ROUTER_PATH.HOME },
  { label: "Đặt vé", href: ROUTER_PATH.TRIP },
  { label: "Khuyến mãi", href: ROUTER_PATH.PROMOS },
  { label: "Hỗ trợ", href: ROUTER_PATH.SUPPORT },
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

export const HomeHeader = ({
  userName = "Khách",
  notifCount = 3,
}: HomeHeaderProps) => {
  const { pathname } = useLocation();

  const isNavItemActive = (href: string) => {
    const normalize = (path: string) =>
      path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

    const currentPath = normalize(pathname);
    const navPath = normalize(href);

    if (navPath === ROUTER_PATH.HOME) {
      return currentPath === navPath;
    }

    return currentPath === navPath || currentPath.startsWith(`${navPath}/`);
  };

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
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`home-header__nav-link${isNavItemActive(item.href) ? " active" : ""}`}
            >
              {item.label}
            </Link>
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
