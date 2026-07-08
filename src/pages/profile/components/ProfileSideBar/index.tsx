import { Avatar, Button, Menu, Tag, type MenuProps } from "antd";
import {
  UserOutlined,
  ProfileOutlined,
  HistoryOutlined,
  CreditCardOutlined,
  SettingOutlined,
  LogoutOutlined,
  StarFilled,
  PhoneOutlined,
  MessageOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { useUser } from "@/common/contexts/UserContext";
import "../style.scss";

// ─── Constants ────────────────────────────────────────────
export const MENU_ITEMS: MenuProps["items"] = [
  {
    key: "overview",
    icon: <ProfileOutlined />,
    label: "Tổng quan",
  },
  {
    key: "account",
    icon: <UserOutlined />,
    label: "Thông tin cá nhân",
  },
  {
    key: "trips",
    icon: <HistoryOutlined />,
    label: "Lịch sử đặt vé",
  },
  {
    key: "messages",
    icon: <MessageOutlined />,
    label: "Tin nhắn",
  },
  {
    key: "company-registration",
    icon: <ApartmentOutlined />,
    label: "Đăng ký trở thành nhà xe",
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Cài đặt",
  },
];

// ─── Props ────────────────────────────────────────────────
interface ProfileSideBarProps {
  selectedKey: string;
  onChange: (key: string) => void;
  onLogout?: () => void;
}

// ─── Component ───────────────────────────────────────────
export const ProfileSideBar = ({
  selectedKey,
  onChange,
  onLogout,
}: ProfileSideBarProps) => {
  const { user } = useUser();

  const initials = user.userName ? user.userName.charAt(0).toUpperCase() : "K";

  return (
    <aside className="profile-sidebar">
      {/* ── Head: avatar + user info ───────────────────── */}
      <div className="profile-sidebar__head">
        <div className="profile-sidebar__avatar-wrap">
          <Avatar
            size={64}
            className="profile-sidebar__avatar"
            src={user.userAvatar || undefined}
            icon={!user.userAvatar ? <UserOutlined /> : undefined}
          >
            {!user.userAvatar && initials}
          </Avatar>

          {/* Online dot */}
          <span
            className="profile-sidebar__online-dot"
            aria-label="Đang hoạt động"
          />
        </div>

        <div className="profile-sidebar__user-info">
          <h2 className="profile-sidebar__name">{user.userName || "Khách"}</h2>

          <p className="profile-sidebar__meta">
            <PhoneOutlined className="profile-sidebar__meta-icon" />
            {user.userPhone || "Chưa cập nhật"}
          </p>

          {/* Member tier badge */}
          {user.rank && (
            <Tag icon={<StarFilled />} className="profile-sidebar__tier-tag">
              {`Thành viên ${user.rank}`}
            </Tag>
          )}
        </div>
      </div>

      {/* ── Nav menu ───────────────────────────────────── */}
      <div className="profile-sidebar__menu-wrapper">
        <Menu
          className="profile-sidebar__menu"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={MENU_ITEMS}
          onClick={({ key }) => onChange(key)}
        />
      </div>

      {/* ── Footer: logout ─────────────────────────────── */}
      <div className="profile-sidebar__footer">
        <Button
          block
          icon={<LogoutOutlined />}
          className="profile-sidebar__logout-btn"
          onClick={onLogout}
        >
          Đăng xuất
        </Button>
      </div>
    </aside>
  );
};
