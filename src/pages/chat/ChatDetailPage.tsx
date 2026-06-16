import {
  CHAT_QUERY_KEYS,
  getChatConversationDetail,
} from "@/api/configs/chat.config";
import { ChatInfoPanel, ChatWindow } from "@/components/Chat";
import { Button, Spin } from "antd";
import { ArrowLeftOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useUser } from "@/common/contexts/UserContext";
import { ROUTER_PATH } from "@/routers/Route";
import type { ConversationResponseDto } from "@/api/dtos/chat.dto";
import "./style.scss";

const QUICK_REPLY_BY_TYPE: Record<ConversationResponseDto["type"], string[]> = {
  OPERATOR: [
    "Tôi cần hỗ trợ về vé",
    "Tôi muốn đổi lịch trình",
    "Gửi thông tin liên hệ",
    "Yêu cầu hóa đơn",
  ],
  ADMIN: [
    "Tôi cần hỗ trợ khẩn cấp",
    "Báo cáo sự cố thanh toán",
    "Đánh giá dịch vụ",
    "Yêu cầu gọi lại",
  ],
  SUPPORT: [
    "Tôi cần hỗ trợ chung",
    "Câu hỏi về tài khoản",
    "Vấn đề kỹ thuật",
    "Yêu cầu hỗ trợ",
  ],
};

export const ChatDetailPage = () => {
  const params = useParams<{ id: string }>();
  const conversationId = Number(params.id);
  const navigate = useNavigate();
  const { user } = useUser();
  const currentUserId = user?.id;
  const [infoOpen, setInfoOpen] = useState(true);

  const conversationQuery = useQuery({
    queryKey: [CHAT_QUERY_KEYS.CONVERSATION_DETAIL, conversationId],
    queryFn: () => getChatConversationDetail(conversationId),
    enabled: Number.isFinite(conversationId),
  });

  if (!Number.isFinite(conversationId)) {
    return (
      <div className="chat-detail chat-detail--empty">
        <h3>ID cuộc trò chuyện không hợp lệ</h3>
        <Button onClick={() => navigate(ROUTER_PATH.CHAT as never)}>
          Quay lại
        </Button>
      </div>
    );
  }

  if (conversationQuery.isLoading) {
    return (
      <div className="chat-detail chat-detail--loading">
        <Spin />
      </div>
    );
  }

  if (!conversationQuery.data) {
    return (
      <div className="chat-detail chat-detail--empty">
        <h3>Không tìm thấy cuộc trò chuyện</h3>
        <p>
          Cuộc trò chuyện có thể đã bị xóa hoặc bạn không có quyền truy cập.
        </p>
        <Button onClick={() => navigate(ROUTER_PATH.CHAT as never)}>
          Quay lại
        </Button>
      </div>
    );
  }

  const conversation = conversationQuery.data;
  const quickReplies = QUICK_REPLY_BY_TYPE[conversation.type].map(
    (label, index) => ({
      id: `${conversation.type}-${index}`,
      label,
      payload: label,
    }),
  );

  return (
    <div className="chat-detail">
      <div className="chat-window-layout chat-detail__layout">
        <div className="chat-window-layout__main">
          <div className="chat-detail__window-wrap">
            <div className="chat-detail__topbar">
              <Button
                type="text"
                shape="circle"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(ROUTER_PATH.CHAT as never)}
                aria-label="Quay lại"
              />
              <div className="chat-detail__topbar-info">
                <h2>{conversation.conversationName}</h2>
                <span>
                  {conversation.type === "OPERATOR"
                    ? "Nhà xe"
                    : "Đội hỗ trợ GoRide"}
                </span>
              </div>
              <Button
                type={infoOpen ? "primary" : "default"}
                ghost={!infoOpen}
                shape="circle"
                icon={<InfoCircleOutlined />}
                onClick={() => setInfoOpen((v) => !v)}
                aria-label="Thông tin hội thoại"
                className="chat-detail__topbar-info-btn"
              />
            </div>
            <ChatWindow
              data={conversation}
              currentUserId={currentUserId}
              quickReplies={quickReplies}
            />
          </div>
        </div>
        {infoOpen ? (
          <div className="chat-window-layout__info">
            <ChatInfoPanel
              conversation={conversation}
              onClose={() => setInfoOpen(false)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
