import { Avatar, Button, Tag } from "antd";
import {
  CalendarOutlined,
  CheckCircleFilled,
  CustomerServiceOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  ShopOutlined,
  StarFilled,
} from "@ant-design/icons";
import "../style.scss";
import type { ConversationResponseDto } from "../../../api/dtos/chat.dto";

export interface ChatInfoPanelProps {
  conversation: ConversationResponseDto;
  onClose?: () => void;
}

const TYPE_LABEL: Record<ConversationResponseDto["type"], string> = {
  OPERATOR: "Nhà xe",
  ADMIN: "Đội hỗ trợ GoRide",
  SUPPORT: "Đội hỗ trợ",
};

const STATS_BY_TYPE: Record<
  ConversationResponseDto["type"],
  Array<{ label: string; value: string; icon: React.ReactNode }>
> = {
  OPERATOR: [
    { label: "Chuyến đã hỗ trợ", value: "1.284", icon: <StarFilled /> },
    { label: "Phản hồi trung bình", value: "2 phút", icon: <CalendarOutlined /> },
    { label: "Mức độ hài lòng", value: "98%", icon: <CheckCircleFilled /> },
  ],
  ADMIN: [
    { label: "Ca trực", value: "24/7", icon: <CalendarOutlined /> },
    { label: "Phản hồi trung bình", value: "30 giây", icon: <CustomerServiceOutlined /> },
    { label: "Đã giải quyết", value: "12.4k", icon: <CheckCircleFilled /> },
  ],
  SUPPORT: [
    { label: "Ca trực", value: "24/7", icon: <CalendarOutlined /> },
    { label: "Phản hồi trung bình", value: "1 phút", icon: <CustomerServiceOutlined /> },
    { label: "Đã giải quyết", value: "9.6k", icon: <CheckCircleFilled /> },
  ],
};

export const ChatInfoPanel = ({ conversation, onClose }: ChatInfoPanelProps) => {
  const displayName =
    conversation.conversationName ||
    conversation.toUser?.fullName ||
    "Cuộc trò chuyện";
  const initials = displayName
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  const stats = STATS_BY_TYPE[conversation.type];
  const role = TYPE_LABEL[conversation.type];
  const isOperator = conversation.type === "OPERATOR";

  return (
    <aside className="chat__info">
      <div className="chat__info-hero">
        {onClose ? (
          <Button
            type="text"
            shape="circle"
            className="chat__info-close"
            onClick={onClose}
            aria-label="Đóng thông tin"
          >
            ×
          </Button>
        ) : null}
        <Avatar
          size={88}
          className="chat__info-avatar"
          src={conversation.conversationAvatar || undefined}
        >
          {initials}
        </Avatar>
        <h3 className="chat__info-name">{displayName}</h3>
        <div className="chat__info-role">
          {isOperator ? <ShopOutlined /> : <CustomerServiceOutlined />}
          <span>{role}</span>
        </div>
        <div className="chat__info-tags">
          <Tag className="chat__info-tag chat__info-tag--verified">
            <CheckCircleFilled /> Đã xác minh
          </Tag>
          <Tag className="chat__info-tag">
            <StarFilled /> 4.9 / 5
          </Tag>
        </div>
      </div>

      <div className="chat__info-section">
        <h4 className="chat__info-section-title">Thông tin liên hệ</h4>
        <ul className="chat__info-list">
          {conversation.toUser?.email ? (
            <li className="chat__info-item">
              <span className="chat__info-item-icon">
                <MailOutlined />
              </span>
              <div className="chat__info-item-body">
                <span className="chat__info-item-label">Email</span>
                <span className="chat__info-item-value">
                  {conversation.toUser.email}
                </span>
              </div>
            </li>
          ) : null}
          {conversation.toUser?.username ? (
            <li className="chat__info-item">
              <span className="chat__info-item-icon">
                <PhoneOutlined />
              </span>
              <div className="chat__info-item-body">
                <span className="chat__info-item-label">Hotline</span>
                <span className="chat__info-item-value">
                  1900-{conversation.toUser.username.toUpperCase().slice(0, 4)}
                </span>
              </div>
            </li>
          ) : null}
          <li className="chat__info-item">
            <span className="chat__info-item-icon">
              <EnvironmentOutlined />
            </span>
            <div className="chat__info-item-body">
              <span className="chat__info-item-label">Khu vực</span>
              <span className="chat__info-item-value">
                {isOperator
                  ? "Toàn quốc — Hỗ trợ 24/7"
                  : "Trụ sở GoRide, TP. Hồ Chí Minh"}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <div className="chat__info-section">
        <h4 className="chat__info-section-title">Thống kê hoạt động</h4>
        <div className="chat__info-stats">
          {stats.map((stat) => (
            <div className="chat__info-stat" key={stat.label}>
              <span className="chat__info-stat-icon">{stat.icon}</span>
              <span className="chat__info-stat-value">{stat.value}</span>
              <span className="chat__info-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chat__info-section">
        <h4 className="chat__info-section-title">Tệp & phương tiện</h4>
        <p className="chat__info-empty">
          Chưa có tệp nào được chia sẻ trong cuộc trò chuyện này.
        </p>
      </div>

      <div className="chat__info-section">
        <h4 className="chat__info-section-title">Cài đặt</h4>
        <ul className="chat__info-list">
          <li className="chat__info-item">
            <span className="chat__info-item-icon">
              <StarFilled />
            </span>
            <div className="chat__info-item-body">
              <span className="chat__info-item-label">Đánh giá cuộc trò chuyện</span>
              <span className="chat__info-item-value chat__info-item-value--muted">
                Sẽ khả dụng sau khi đóng hội thoại
              </span>
            </div>
          </li>
        </ul>
      </div>
    </aside>
  );
};
