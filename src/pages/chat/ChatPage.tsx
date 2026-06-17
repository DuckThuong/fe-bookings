import {
  CHAT_QUERY_KEYS,
  createChatConversation,
  getChatConversations,
  getOperatorHotlines,
  sendChatMessage,
} from "@/api/configs/chat.config";
import { chatSocket } from "@/socket/domains/chat.socket";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Avatar, Badge, Button, Empty, Input, Spin } from "antd";
import {
  SearchOutlined,
  ShopOutlined,
  CustomerServiceOutlined,
  PlusOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ROUTER_PATH } from "@/routers/Route";
import type { ConversationResponseDto } from "@/api/dtos/chat.dto";
import {
  ChatListItem,
  ChatWindow,
  ChatInfoPanel,
} from "@/components/Chat";
import "./style.scss";

type FilterKey = "all" | "operator" | "admin";

const FILTER_LABELS: Record<FilterKey, string> = {
  all: "Tất cả",
  operator: "Nhà xe",
  admin: "Hỗ trợ viên",
};

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

export const ChatPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [infoOpen, setInfoOpen] = useState(true);
  const [pendingConversation, setPendingConversation] =
    useState<ConversationResponseDto | null>(null);

  const conversationsQuery = useQuery({
    queryKey: [CHAT_QUERY_KEYS.CONVERSATIONS],
    queryFn: getChatConversations,
  });

  const operatorsQuery = useQuery({
    queryKey: [CHAT_QUERY_KEYS.OPERATORS],
    queryFn: getOperatorHotlines,
  });

  const startConversationMutation = useMutation({
    mutationFn: createChatConversation,
    onSuccess: (conversation) => {
      setPendingConversation(conversation);
      setSelectedId(conversation.conversationId);
      queryClient.invalidateQueries({
        queryKey: [CHAT_QUERY_KEYS.CONVERSATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [CHAT_QUERY_KEYS.CONVERSATION_MESSAGES, conversation.conversationId],
      });
    },
  });

  const conversations = conversationsQuery.data ?? [];
  const operators = operatorsQuery.data ?? [];

  // Keep conversations list live via socket
  useEffect(() => {
    const unsubConversation = chatSocket.subscribeConversationUpdated((event) => {
      const updated = event.data;
      queryClient.setQueryData<ConversationResponseDto[]>(
        [CHAT_QUERY_KEYS.CONVERSATIONS],
        (current = []) => {
          const exists = current.some(
            (c) => c.conversationId === updated.conversationId,
          );
          if (exists) {
            return current.map((c) =>
              c.conversationId === updated.conversationId ? updated : c,
            );
          }
          return [updated, ...current];
        },
      );
    });

    const unsubMessage = chatSocket.subscribeMessageSent((event) => {
      const incoming = event.data;
      queryClient.setQueryData<ConversationResponseDto[]>(
        [CHAT_QUERY_KEYS.CONVERSATIONS],
        (current = []) => {
          return current.map((c) =>
            c.conversationId === incoming.conversationId
              ? {
                  ...c,
                  lastMessagePreview: incoming.content ?? "(đính kèm)",
                  lastMessageAt: incoming.createdAt,
                  unreadCount:
                    c.unreadCount !== undefined ? c.unreadCount + 1 : 1,
                }
              : c,
          );
        },
      );
    });

    return () => {
      unsubConversation();
      unsubMessage();
    };
  }, [queryClient]);

  const filteredConversations = useMemo(() => {
    let items = conversations;
    if (filter !== "all") {
      items = items.filter((item) =>
        filter === "operator" ? item.type === "OPERATOR" : item.type === "ADMIN",
      );
    }
    if (search.trim()) {
      const keyword = search.toLowerCase();
      items = items.filter(
        (item) =>
          (item.conversationName ?? "").toLowerCase().includes(keyword) ||
          (item.lastMessagePreview ?? "").toLowerCase().includes(keyword),
      );
    }
    return items;
  }, [conversations, filter, search]);

  // Auto-select first conversation
  const activeConversation = useMemo(() => {
    const baseList = pendingConversation
      ? [
          pendingConversation,
          ...filteredConversations.filter(
            (c) => c.conversationId !== pendingConversation.conversationId,
          ),
        ]
      : filteredConversations;
    if (baseList.length === 0) return null;
    const found = baseList.find((c) => c.conversationId === selectedId);
    return found ?? baseList[0];
  }, [filteredConversations, pendingConversation, selectedId]);

  // Khi conversation vừa tạo đã xuất hiện trong list, clear pending.
  useEffect(() => {
    if (
      pendingConversation &&
      conversations.some(
        (c) => c.conversationId === pendingConversation.conversationId,
      )
    ) {
      setPendingConversation(null);
    }
  }, [conversations, pendingConversation]);

  const totalUnread = useMemo(
    () => conversations.reduce((sum, item) => sum + (item.unreadCount ?? 0), 0),
    [conversations],
  );

  const isLoading = conversationsQuery.isLoading;
  const isEmpty = !isLoading && filteredConversations.length === 0;

  const handleStartWithOperator = (operator: ConversationResponseDto) => {
    const userId = operator.toUser?.userId;
    if (!userId) return;
    const type: ConversationResponseDto["type"] =
      operator.toUser?.role === "ADMIN" ? "ADMIN" : "OPERATOR";
    startConversationMutation.mutate({ toUserId: userId, type });
  };

  const quickReplies = activeConversation
    ? QUICK_REPLY_BY_TYPE[activeConversation.type]?.map((label, index) => ({
      id: `${activeConversation.type}-${index}`,
      label,
      payload: label,
    }))
    : [];

  return (
    <div className="chat-page">
      <div className="chat-page__inner">
        <header className="chat-page__hero">
          <div className="chat-page__hero-main">
            <span className="chat-page__hero-eyebrow">Hỗ trợ & trò chuyện</span>
            <h1 className="chat-page__hero-title">Tin nhắn</h1>
            <p className="chat-page__hero-desc">
              Trò chuyện với nhà xe và đội ngũ hỗ trợ GoRide.
            </p>
          </div>
          {totalUnread > 0 ? (
            <div className="chat-page__hero-stat">
              <Badge
                count={totalUnread}
                style={{ backgroundColor: "#f5a623" }}
                overflowCount={99}
              />
              <span className="chat-page__hero-stat-text">tin nhắn chưa đọc</span>
            </div>
          ) : null}
        </header>

        <div className="chat-window-layout">
          <aside className="chat-window-layout__list">
            <div className="chat-page__list-toolbar">
              <Input
                allowClear
                size="large"
                value={search}
                prefix={<SearchOutlined />}
                placeholder="Tìm cuộc trò chuyện..."
                onChange={(e) => setSearch(e.target.value)}
                className="chat-page__list-search"
              />
              <div className="chat-page__list-filters">
                <FilterOutlined className="chat-page__list-filter-icon" />
                {(Object.keys(FILTER_LABELS) as FilterKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`chat-page__list-filter ${filter === key ? "chat-page__list-filter--active" : ""
                      }`}
                    onClick={() => setFilter(key)}
                  >
                    {FILTER_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>

            <div className="chat-page__list-meta">
              <span>{filteredConversations.length} cuộc trò chuyện</span>
            </div>

            <div className="chat-page__list-scroll">
              {isLoading ? (
                <div className="chat-page__list-loading">
                  <Spin />
                </div>
              ) : isEmpty ? (
                <Empty
                  description="Chưa có cuộc trò chuyện nào."
                  className="chat-page__list-empty"
                />
              ) : (
                filteredConversations.map((conversation) => (
                  <ChatListItem
                    key={conversation.conversationId}
                    conversation={conversation}
                    isActive={
                      activeConversation?.conversationId ===
                      conversation.conversationId
                    }
                    onClick={() => setSelectedId(conversation.conversationId)}
                  />
                ))
              )}
            </div>

            <div className="chat-page__list-hotlines">
              <h4 className="chat-page__list-hotlines-title">
                Liên hệ nhanh
              </h4>
              {operatorsQuery.isLoading ? (
                <div className="chat-page__list-hotline chat-page__list-hotline--loading">
                  <Spin size="small" />
                  <span>Đang tải danh sách hỗ trợ…</span>
                </div>
              ) : operators.length === 0 ? (
                <div className="chat-page__list-hotline chat-page__list-hotline--empty">
                  <CustomerServiceOutlined />
                  <span>Chưa có nhân viên hỗ trợ nào.</span>
                </div>
              ) : (
                operators.slice(0, 3).map((operator) => {
                  const isAdmin = operator.toUser?.role === "ADMIN";
                  return (
                    <button
                      key={operator.toUser?.userId ?? operator.conversationId}
                      type="button"
                      className={`chat-page__list-hotline ${isAdmin ? "chat-page__list-hotline--admin" : ""
                        }`}
                      disabled={startConversationMutation.isPending}
                      onClick={() => handleStartWithOperator(operator)}
                    >
                      <Avatar
                        size={32}
                        src={operator.conversationAvatar || undefined}
                        style={
                          !operator.conversationAvatar && isAdmin
                            ? { background: "#16a34a" }
                            : undefined
                        }
                        icon={!operator.conversationAvatar ? <CustomerServiceOutlined /> : undefined}
                      >
                        {!operator.conversationAvatar
                          ? (operator.conversationName ?? "?").charAt(0)
                          : null}
                      </Avatar>
                      <div className="chat-page__list-hotline-info">
                        <span className="chat-page__list-hotline-name">
                          {operator.conversationName ?? "Hỗ trợ"}
                        </span>
                        <span className="chat-page__list-hotline-role">
                          {isAdmin ? (
                            <>
                              <CustomerServiceOutlined /> Đội CSKH
                            </>
                          ) : (
                            <>
                              <ShopOutlined /> Nhà xe
                            </>
                          )}
                        </span>
                      </div>
                      <PlusOutlined className="chat-page__list-hotline-icon" />
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <div className="chat-window-layout__main">
            {activeConversation ? (
              <ChatWindow
                data={activeConversation}
                quickReplies={quickReplies}
                onQuickReplySelect={(reply) => {
                  if (!activeConversation || !reply.payload) return;
                  void sendChatMessage({
                    conversationId: activeConversation.conversationId,
                    content: reply.payload,
                  }).then(() => {
                    queryClient.invalidateQueries({
                      queryKey: [
                        CHAT_QUERY_KEYS.CONVERSATION_MESSAGES,
                        activeConversation.conversationId,
                      ],
                    });
                    queryClient.invalidateQueries({
                      queryKey: [CHAT_QUERY_KEYS.CONVERSATIONS],
                    });
                  });
                }}
              />
            ) : (
              <div className="chat-page__placeholder">
                <div className="chat-page__placeholder-illu" aria-hidden>
                  💬
                </div>
                <h3>Chọn một cuộc trò chuyện</h3>
                <p>
                  Hoặc bắt đầu nhanh với nhà xe hoặc đội hỗ trợ GoRide từ danh
                  sách bên trái.
                </p>
              </div>
            )}
          </div>

          {activeConversation && infoOpen ? (
            <div className="chat-window-layout__info">
              <ChatInfoPanel
                conversation={activeConversation}
                onClose={() => setInfoOpen(false)}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
