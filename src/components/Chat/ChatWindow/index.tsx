import { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Tooltip,
  type MenuProps,
} from "antd";
import {
  BellOutlined,
  CheckCircleFilled,
  CopyOutlined,
  EllipsisOutlined,
  PushpinFilled,
  PushpinOutlined,
  SearchOutlined,
  SoundOutlined,
  StarFilled,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatInput } from "../ChatInput";
import { ChatLabel } from "../ChatLabel";
import { ChatQuickReplies, type QuickReply } from "../ChatQuickReplies";
import {
  getConversationMessages,
  muteConversation,
  pinConversation,
  setConversationNickname,
} from "../../../api/configs/chat.config";
import {
  CHAT_QUERY_KEYS,
  ConverationEndpoint,
} from "../../../api/endpoints/chat.endpoint";
import { chatSocket } from "../../../socket/domains/chat.socket";
import type {
  ConversationResponseDto,
  MessageAttachmentResponseDto,
  MessageResponseDto,
  MuteConversationPreset,
} from "../../../api/dtos/chat.dto";
import { USE_MOCK } from "../../../api/configs/chat.config";
import "../style.scss";

export interface ChatWindowProps {
  data: ConversationResponseDto;
  currentUserId?: number;
  quickReplies?: QuickReply[];
  onQuickReplySelect?: (reply: QuickReply) => void;
}

const QUICK_REPLY_PRESETS: QuickReply[] = [
  { id: "qr-1", label: "Tôi cần hỗ trợ về vé", payload: "Tôi cần hỗ trợ về vé" },
  {
    id: "qr-2",
    label: "Tôi muốn đổi lịch trình",
    payload: "Tôi muốn đổi lịch trình",
  },
  {
    id: "qr-3",
    label: "Gửi thông tin liên hệ",
    payload: "Tôi muốn gửi thông tin liên hệ",
  },
  {
    id: "qr-4",
    label: "Yêu cầu hóa đơn",
    payload: "Tôi cần hóa đơn VAT",
  },
];

const MUTE_OPTIONS: { key: string; label: string; preset: MuteConversationPreset }[] = [
  { key: "15m", label: "15 phút", preset: "15m" },
  { key: "1h", label: "1 giờ", preset: "1h" },
  { key: "8h", label: "8 giờ", preset: "8h" },
  { key: "24h", label: "24 giờ", preset: "24h" },
  {
    key: "until-reenable",
    label: "Cho đến khi tôi bật lại",
    preset: "no end time yet",
  },
];

export const ChatWindow = ({
  data,
  currentUserId,
  quickReplies,
  onQuickReplySelect,
}: ChatWindowProps) => {
  const queryClient = useQueryClient();
  const bodyRef = useRef<HTMLElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");
  const [composerHeight, setComposerHeight] = useState(120);
  const [lightbox, setLightbox] = useState<{
    images: MessageAttachmentResponseDto[];
    index: number;
  } | null>(null);

  const currentParticipant = useMemo(
    () =>
      currentUserId != null
        ? data.participants.find((p) => p.userId === currentUserId)
        : undefined,
    [currentUserId, data.participants],
  );

  const fallbackName =
    data.conversationName ||
    data.toUser?.fullName ||
    data.toUser?.username ||
    "Cuộc trò chuyện";
  const displayName = currentParticipant?.nickname || fallbackName;
  const displayAvatar =
    data.conversationAvatar || data.toUser?.avatarUrl || "";
  const displayEmail = data.toUser?.email || "";
  const isPinned = !!currentParticipant?.isPinned;
  const isMuted = !!currentParticipant?.isMuted;

  const messagesQuery = useQuery<MessageResponseDto[]>({
    queryKey: [CHAT_QUERY_KEYS.CONVERSATION_MESSAGES, data.conversationId],
    queryFn: () =>
      getConversationMessages(data.conversationId, { page: 1, limit: 50 }),
    enabled: !!data.conversationId,
  });

  const sortedMessages = useMemo(
    () =>
      [...(messagesQuery.data ?? [])].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [messagesQuery.data],
  );

  const filteredMessages = useMemo(() => {
    if (!search.trim()) return sortedMessages;
    const q = search.toLowerCase();
    return sortedMessages.filter((m) =>
      (m.content ?? "").toLowerCase().includes(q),
    );
  }, [sortedMessages, search]);

  const latestMessage = sortedMessages[sortedMessages.length - 1];
  const lastOwnMessageId = useMemo(
    () =>
      [...sortedMessages]
        .reverse()
        .find((item) => item.senderId === currentUserId)?.id,
    [currentUserId, sortedMessages],
  );

  useEffect(() => {
    if (!data.conversationId) return;
    chatSocket.joinConversation(data.conversationId).catch(() => {
      // socket chưa sẵn sàng - bỏ qua im lặng
    });
    return () => {
      chatSocket.leaveConversation(data.conversationId).catch(() => {
        // socket chưa sẵn sàng - bỏ qua im lặng
      });
    };
  }, [data.conversationId]);

  useEffect(() => {
    const unsubscribeMessage = chatSocket.subscribeMessageSent((event) => {
      if (event.data.conversationId !== data.conversationId) return;
      queryClient.setQueryData<MessageResponseDto[]>(
        [CHAT_QUERY_KEYS.CONVERSATION_MESSAGES, data.conversationId],
        (current = []) => {
          if (current.some((item) => item.id === event.data.id)) {
            return current;
          }
          return [...current, event.data];
        },
      );
    });

    const unsubscribeStatus = chatSocket.subscribeMessageStatusUpdated(
      (event) => {
        if (event.data.conversationId !== data.conversationId) return;
        queryClient.setQueryData<MessageResponseDto[]>(
          [CHAT_QUERY_KEYS.CONVERSATION_MESSAGES, data.conversationId],
          (current = []) =>
            current.map((item) =>
              item.id === event.data.messageId
                ? { ...item, status: event.data.status }
                : item,
            ),
        );
      },
    );

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
    };
  }, [data.conversationId, queryClient]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [sortedMessages.length]);

  useEffect(() => {
    if (!latestMessage) return;
    if (latestMessage.senderId === currentUserId) return;
    if (latestMessage.status === "READ") return;
    if (USE_MOCK) return;
    chatSocket
      .markConversationAsRead({
        conversationId: data.conversationId,
        messageId: latestMessage.id,
      })
      .catch(() => {
        // socket chưa sẵn sàng - bỏ qua im lặng
      });
  }, [latestMessage, currentUserId, data.conversationId]);

  const pinMutation = useMutation({
    mutationFn: (nextPinned: boolean) =>
      pinConversation({
        conversationId: data.conversationId,
        isPinned: nextPinned,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ConverationEndpoint.CHAT_CONVERSATION_DETAIL, data.conversationId],
      });
    },
  });

  const muteMutation = useMutation({
    mutationFn: (preset: MuteConversationPreset) =>
      muteConversation({
        conversationId: data.conversationId,
        preset,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ConverationEndpoint.CHAT_CONVERSATION_DETAIL, data.conversationId],
      });
    },
  });

  const nicknameMutation = useMutation({
    mutationFn: (nickname: string | null) =>
      setConversationNickname({
        conversationId: data.conversationId,
        nickname,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ConverationEndpoint.CHAT_CONVERSATION_DETAIL, data.conversationId],
      });
    },
  });

  const handleMenuClick: MenuProps["onClick"] = async ({ key }) => {
    if (key === "nickname") {
      const next = window.prompt("Đặt biệt danh cho cuộc trò chuyện", displayName);
      if (next !== null) {
        await nicknameMutation.mutateAsync(next.trim() || null);
      }
      return;
    }
    if (key === "pin") {
      await pinMutation.mutateAsync(!isPinned);
      return;
    }
    const muteOption = MUTE_OPTIONS.find((item) => item.key === key);
    if (muteOption) {
      await muteMutation.mutateAsync(muteOption.preset);
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "nickname",
      label: "Đặt biệt danh",
      icon: <CopyOutlined />,
    },
    {
      key: "pin",
      label: isPinned ? "Bỏ ghim cuộc trò chuyện" : "Ghim cuộc trò chuyện",
      icon: isPinned ? <PushpinFilled /> : <PushpinOutlined />,
    },
    {
      key: "mute",
      label: "Tắt thông báo",
      icon: <BellOutlined />,
      children: MUTE_OPTIONS.map((option) => ({
        key: option.key,
        label: option.label,
      })),
    },
  ];

  const openImageViewer = (
    images: MessageAttachmentResponseDto[],
    startIndex: number,
  ) => {
    setLightbox({ images, index: startIndex });
  };

  const closeLightbox = () => setLightbox(null);
  const showPrev = () =>
    setLightbox((current) =>
      current && current.images.length > 1
        ? {
          ...current,
          index:
            (current.index - 1 + current.images.length) %
            current.images.length,
        }
        : current,
    );
  const showNext = () =>
    setLightbox((current) =>
      current && current.images.length > 1
        ? {
          ...current,
          index: (current.index + 1) % current.images.length,
        }
        : current,
    );

  const replies = quickReplies ?? QUICK_REPLY_PRESETS;

  return (
    <div
      className="chat__window"
      style={
        {
          ["--chat-footer-height" as string]: `${composerHeight}px`,
        } as React.CSSProperties
      }
    >
      <header className="chat__window-header">
        <div className="chat__window-header-main">
          <Avatar
            size={48}
            className="chat__window-avatar"
            src={displayAvatar || undefined}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
          <div className="chat__window-info">
            <div className="chat__window-name-row">
              <h3 className="chat__window-name">{displayName}</h3>
              {data.type === "ADMIN" ? (
                <Tooltip title="Đội ngũ chính thức GoRide">
                  <CheckCircleFilled className="chat__window-verified" />
                </Tooltip>
              ) : null}
            </div>
            <div className="chat__window-sub">
              <span className="chat__window-status-dot" />
              <span className="chat__window-status-text">
                {isMuted ? "Đang tắt thông báo" : "Đang hoạt động"}
              </span>
              <span className="chat__window-divider" />
              <span className="chat__window-email">{displayEmail}</span>
            </div>
          </div>
        </div>
        <div className="chat__window-header-actions">
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Tìm trong cuộc trò chuyện"
            className="chat__window-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Tooltip title={isMuted ? "Bật thông báo" : "Tắt thông báo"}>
            <Button
              type="text"
              shape="circle"
              className="chat__window-icon-btn"
              icon={
                isMuted ? (
                  <SoundOutlined style={{ opacity: 0.4 }} />
                ) : (
                  <BellOutlined />
                )
              }
            />
          </Tooltip>
          <Tooltip title={isPinned ? "Bỏ ghim" : "Ghim cuộc trò chuyện"}>
            <Button
              type="text"
              shape="circle"
              className={`chat__window-icon-btn ${isPinned ? "chat__window-icon-btn--active" : ""}`}
              icon={isPinned ? <PushpinFilled /> : <PushpinOutlined />}
              onClick={() => pinMutation.mutate(!isPinned)}
            />
          </Tooltip>
          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              shape="circle"
              className="chat__window-icon-btn"
              icon={<EllipsisOutlined />}
            />
          </Dropdown>
        </div>
      </header>

      <section
        ref={bodyRef}
        className="chat__window-body"
        aria-label="Danh sách tin nhắn"
      >
        {filteredMessages.length === 0 ? (
          <div className="chat__window-empty">
            <div className="chat__window-empty-illu" aria-hidden>
              <StarFilled />
            </div>
            <h4>Bắt đầu cuộc trò chuyện</h4>
            <p>
              {search.trim()
                ? `Không tìm thấy tin nhắn phù hợp với "${search.trim()}".`
                : "Gửi tin nhắn đầu tiên để kết nối với "}
              {!search.trim() ? displayName : null}
            </p>
          </div>
        ) : (
          <div className="chat__window-stream">
            {filteredMessages.map((message) => (
              <ChatLabel
                key={message.id}
                isYour={message.senderId === currentUserId}
                senderName={message.senderName}
                timeLine={message.createdAt}
                content={message.content || ""}
                avartar={message.senderAvatarUrl || displayAvatar}
                type={message.type}
                attachments={message.attachments}
                onOpenImageViewer={openImageViewer}
                messageStatus={
                  message.status === "SENT" ||
                    message.status === "DELIVERED" ||
                    message.status === "READ"
                    ? message.status
                    : undefined
                }
                showStatus={
                  message.senderId === currentUserId &&
                  message.id === lastOwnMessageId
                }
              />
            ))}
            <div ref={endRef} />
          </div>
        )}
      </section>

      <div className="chat__window-quick-row">
        <ChatQuickReplies
          replies={replies}
          onSelect={onQuickReplySelect}
          title={
            data.type === "ADMIN" ? "Hỗ trợ nhanh" : "Câu hỏi thường gặp"
          }
        />
      </div>

      <div className="chat__window-footer">
        <ChatInput
          conversationId={data.conversationId}
          onComposerHeightChange={setComposerHeight}
          placeholder={`Nhắn cho ${displayName}...`}
        />
      </div>

      {lightbox ? (
        <div
          className="chat__window-lightbox"
          role="dialog"
          aria-label="Xem ảnh đính kèm"
        >
          <button
            type="button"
            className="chat__window-lightbox-backdrop"
            onClick={closeLightbox}
            aria-label="Đóng"
          />
          <div className="chat__window-lightbox-content">
            <header className="chat__window-lightbox-top">
              <span className="chat__window-lightbox-counter">
                {lightbox.index + 1}/{lightbox.images.length}
              </span>
              <span className="chat__window-lightbox-name">
                {lightbox.images[lightbox.index]?.fileName ?? "Ảnh đính kèm"}
              </span>
              <Button
                type="text"
                shape="circle"
                onClick={closeLightbox}
                icon={<UserOutlined />}
                className="chat__window-lightbox-close"
                aria-label="Đóng ảnh"
              />
            </header>
            <div className="chat__window-lightbox-stage">
              {lightbox.images.length > 1 ? (
                <Button
                  type="text"
                  shape="circle"
                  className="chat__window-lightbox-nav chat__window-lightbox-nav--prev"
                  onClick={showPrev}
                  aria-label="Ảnh trước"
                >
                  ‹
                </Button>
              ) : null}
              <img
                src={lightbox.images[lightbox.index]?.url}
                alt={lightbox.images[lightbox.index]?.fileName ?? "image"}
                className="chat__window-lightbox-image"
              />
              {lightbox.images.length > 1 ? (
                <Button
                  type="text"
                  shape="circle"
                  className="chat__window-lightbox-nav chat__window-lightbox-nav--next"
                  onClick={showNext}
                  aria-label="Ảnh tiếp theo"
                >
                  ›
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
