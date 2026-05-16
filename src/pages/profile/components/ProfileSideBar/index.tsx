import { Avatar, Button, Menu, type MenuProps } from "antd";
import {
  UserOutlined,
  ProfileOutlined,
  HistoryOutlined,
  CreditCardOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useUser } from "@/common/contexts/UserContext";
import "../style.scss";

const MENU_ITEMS: MenuProps["items"] = [
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
    key: "payment",
    icon: <CreditCardOutlined />,
    label: "Phương thức thanh toán",
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Cài đặt",
  },
];

interface ProfileSideBarProps {
  selectedKey: string;
  onChange: (key: string) => void;
}

export const ProfileSideBar = ({
  selectedKey,
  onChange,
}: ProfileSideBarProps) => {
  const { user } = useUser();

  return (
    <aside className="profile-sidebar">
      <div className="profile-sidebar__head">
        <Avatar
          size={64}
          className="profile-sidebar__avatar"
          icon={<UserOutlined />}
          src={user.avatarUrl}
        />
        <div className="profile-sidebar__user-info">
          <h2 className="profile-sidebar__name">{user.userName || "Khách"}</h2>
          <p className="profile-sidebar__meta">
            {user.phone || "Chưa cập nhật số điện thoại"}
          </p>
        </div>
      </div>

      <div className="profile-sidebar__menu-wrapper">
        <Menu
          className="profile-sidebar__menu"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={MENU_ITEMS}
          onClick={(info) => onChange(info.key.toString())}
        />
      </div>

      <div className="profile-sidebar__footer">
        <Button type="default" block icon={<LogoutOutlined />}>
          Đăng xuất
        </Button>
      </div>
    </aside>
  );
};
