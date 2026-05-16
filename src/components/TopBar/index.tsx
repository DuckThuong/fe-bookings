import { Badge, Avatar, Button, Dropdown, Menu } from "antd";
import type { MenuProps } from "antd";
import { Logo } from "@/components/Logo";
import profileIcn from "@/assets/icons/profile.svg";
import tripsIcn from "@/assets/icons/trip.svg";
import settingsIcn from "@/assets/icons/setting.svg";
import logoutIcn from "@/assets/icons/logout.svg";
import bellIcn from "@/assets/icons/bell.svg";
import chevronDownIcn from "@/assets/icons/chevron-down.svg";
import { ROUTER_PATH } from "@/routers/Route";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/common/contexts/UserContext";
import { MENU_ITEMS } from "@/pages/profile/components/ProfileSideBar";
import { ProfileInformation } from "@/pages/profile/pages/Page2";
import { ProfileSummary } from "@/pages/profile/pages/Page1";
import { ProfileTicket } from "@/pages/profile/pages/Page3";
import { ProfilePayment } from "@/pages/profile/pages/Page4";
import { ProfileSettings } from "@/pages/profile/pages/Page5";

const NAV_ITEMS = [
  { label: "Trang chủ", href: ROUTER_PATH.HOME },
  { label: "Đặt vé", href: ROUTER_PATH.TRIP },
  { label: "Khuyến mãi", href: ROUTER_PATH.PROMOS },
  { label: "Hỗ trợ", href: ROUTER_PATH.SUPPORT },
];

export const HomeHeader = () => {
  const { pathname } = useLocation();
  const { user } = useUser();
  const { userName, notifCount } = user;
  const navigate = useNavigate();

  const isNavItemActive = (href: string) => {
    const normalize = (path: string) =>
      path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

    const currentPath = normalize(pathname);
    const navPath = normalize(href);

    if (navPath === ROUTER_PATH.HOME) {
      return currentPath === navPath;
    }

    if (navPath === ROUTER_PATH.TRIP) {
      return (
        currentPath === navPath ||
        currentPath.startsWith(`${navPath}/`) ||
        currentPath === ROUTER_PATH.BOOKING ||
        currentPath.startsWith(`${ROUTER_PATH.BOOKING}/`)
      );
    }

    return currentPath === navPath || currentPath.startsWith(`${navPath}/`);
  };

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "account":
        navigate(ROUTER_PATH.PROFILE, { state: { tab: "account" } });
        break;

      case "overview":
        navigate(ROUTER_PATH.PROFILE, { state: { tab: "overview" } });
        break;
      case "trips":
        navigate(ROUTER_PATH.PROFILE, { state: { tab: "trips" } });
        break;
      case "payment":
        navigate(ROUTER_PATH.PROFILE, { state: { tab: "payment" } });
        break;
      case "settings":
        navigate(ROUTER_PATH.PROFILE, { state: { tab: "settings" } });
        break;
      default:
        navigate(ROUTER_PATH.PROFILE, { state: { tab: "overview" } });
    }
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
            <Button className="home-header__icon-btn" aria-label="Thông báo">
              <img src={bellIcn} alt="Bell" width={20} height={20} />
            </Button>
          </Badge>

          {/* Avatar dropdown */}
          <Dropdown
            placement="bottomRight"
            trigger={["click"]}
            dropdownRender={() => (
              <Menu
                className="home-header__user-menu"
                items={MENU_ITEMS}
                onClick={handleMenuClick}
              />
            )}
          >
            <Button className="home-header__avatar-btn">
              <Avatar size={34} className="home-header__avatar">
                {userName?.charAt(0).toUpperCase() || "K"}
              </Avatar>
              <span className="home-header__username">
                {userName || "Khách"}
              </span>
              <img
                src={chevronDownIcn}
                alt="Chevron Down"
                width={10}
                height={10}
              />
            </Button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};
