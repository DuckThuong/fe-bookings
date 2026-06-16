import { Avatar, Badge } from "antd";
import {
  CheckCircleFilled,
  CustomerServiceOutlined,
  PushpinFilled,
  ShopOutlined,
} from "@ant-design/icons";
import { formatLastMessageAt } from "../../../common/contexts/format";
import "../style.scss";
import type { ConversationResponseDto } from "../../../api/dtos/chat.dto";

export interface ChatListItemProps {
  conversation: ConversationResponseDto;
  isActive?: boolean;
  onClick?: () => void;
}

const TYPE_ICON: Record<ConversationResponseDto["type"], React.ReactNode> = {
  OPERATOR: <ShopOutlined />,
  ADMIN: <CustomerServiceOutlined />,
  SUPPORT: <CustomerServiceOutlined />,
};

const TYPE_LABEL: Record<ConversationResponseDto["type"], string> = {
  OPERATOR: "Nhà xe",
  ADMIN: "Hỗ trợ viên",
  SUPPORT: "Hỗ trợ viên",
};

const TYPE_BADGE_CLASS: Record<ConversationResponseDto["type"], string> = {
  OPERATOR: "chat__list-type--op",
  ADMIN: "chat__list-type--admin",
  SUPPORT: "chat__list-type--admin",
};

const getDisplayName = (conversation: ConversationResponseDto) =>
  conversation.conversationName ||
  conversation.toUser?.fullName ||
  "Cuộc trò chuyện";

const getInitials = (conversation: ConversationResponseDto) => {
  const name = getDisplayName(conversation);
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

const getPreview = (conversation: ConversationResponseDto) => {
  if (conversation.lastMessagePreview) {
    return conversation.lastMessagePreview;
  }
  if (conversation.type === "OPERATOR") {
    return "Hỗ trợ về vé, lịch trình và dịch vụ nhà xe.";
  }
  return "Đội ngũ GoRide luôn sẵn sàng hỗ trợ bạn.";
};

const isOnline = (conversation: ConversationResponseDto) =>
  conversation.type === "ADMIN" ||
  (conversation.participants[1]?.isMuted === false &&
    conversation.participants.length > 1);

export const ChatListItem = ({
  conversation,
  isActive,
  onClick,
}: ChatListItemProps) => {
  const displayName = getDisplayName(conversation);
  const initials = getInitials(conversation);
  const preview = getPreview(conversation);
  const unread = conversation.unreadCount ?? 0;
  const isPinned = conversation.participants[0]?.isPinned;
  const isMuted = conversation.participants[0]?.isMuted;
  const online = isOnline(conversation);

  return (
    <button
      type="button"
      className={`chat__list-item ${isActive ? "chat__list-item--active" : ""}`}
      onClick={onClick}
    >
      <div className="chat__list-avatar">
        <Avatar
          size={48}
          className="chat__list-avatar-img"
          src={conversation.conversationAvatar || undefined}
        >
          {initials}
        </Avatar>
        <span
          className={`chat__list-type ${TYPE_BADGE_CLASS[conversation.type]}`}
        >
          {TYPE_ICON[conversation.type]}
        </span>
        {online ? <span className="chat__list-online" /> : null}
        {unread > 0 ? (
          <Badge
            count={unread}
            size="small"
            className="chat__list-badge"
            overflowCount={99}
          />
        ) : null}
      </div>

      <div className="chat__list-body">
        <div className="chat__list-line-1">
          <span
            className={`chat__list-name ${unread > 0 ? "chat__list-name--unread" : ""}`}
          >
            {displayName}
          </span>
          <span className="chat__list-time">
            {conversation.lastMessageAt
              ? formatLastMessageAt(conversation.lastMessageAt)
              : ""}
          </span>
        </div>

        <div className="chat__list-line-2">
          <span
            className={`chat__list-preview ${unread > 0 ? "chat__list-preview--unread" : ""}`}
          >
            {preview}
          </span>
          <span className="chat__list-meta">
            {isPinned ? (
              <span className="chat__list-pin" aria-label="Đã ghim">
                <PushpinFilled />
              </span>
            ) : null}
            {isMuted && !isPinned ? (
              <span className="chat__list-muted" aria-label="Đang tắt tiếng">
                🔕
              </span>
            ) : null}
          </span>
        </div>

        <div className="chat__list-tags">
          <span className={`chat__list-tag ${TYPE_BADGE_CLASS[conversation.type]}`}>
            {TYPE_LABEL[conversation.type]}
          </span>
          {conversation.toUser?.email ? (
            <span className="chat__list-tag chat__list-tag--muted">
              <CheckCircleFilled /> Đã xác minh
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
};
