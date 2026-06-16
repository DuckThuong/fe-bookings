import type {
  ConversationResponseDto,
  GetMessagesParams,
  MessageResponseDto,
  MuteConversationPreset,
  SendMessagePayloadDto,
} from "../../dtos/chat.dto";

// ─── Mock helpers ────────────────────────────────────────────────────────
const HOUR = 1000 * 60 * 60;

const mockParticipants = (
  isPinned: boolean,
  isMuted: boolean,
  nickname?: string,
) => [
  {
    userId: 1,
    nickname,
    isPinned,
    isMuted,
    mutedUntil: isMuted
      ? new Date(Date.now() + 8 * HOUR).toISOString()
      : undefined,
  },
  {
    userId: 101,
    nickname: "Nhà xe Phương Trang",
    isPinned: false,
    isMuted: false,
  },
];

// ─── In-memory mutable store ────────────────────────────────────────────
export const mockConversations: ConversationResponseDto[] = [
  {
    conversationId: 1,
    conversationName: "Phương Trang — Hỗ trợ vé",
    conversationAvatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=PT&backgroundColor=e63946&textColor=ffffff",
    conversationCreatedAt: new Date(
      Date.now() - 24 * 7 * HOUR,
    ).toISOString(),
    lastMessagePreview: "Chào anh/chị, chuyến HN → ĐN đã được xác nhận.",
    lastMessageAt: new Date(Date.now() - 0.25 * HOUR).toISOString(),
    unreadCount: 2,
    type: "OPERATOR",
    toUser: {
      userId: 101,
      fullName: "Phương Trang Futa",
      username: "phuongtrang",
      avatarUrl:
        "https://api.dicebear.com/7.x/initials/svg?seed=PT&backgroundColor=e63946&textColor=ffffff",
      email: "support@phuongtrang.vn",
      role: "OPERATOR",
    },
    participants: mockParticipants(true, false, "Phương Trang"),
  },
  {
    conversationId: 2,
    conversationName: "Thiên Long — Hỗ trợ đổi vé",
    conversationAvatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=TL&backgroundColor=2563eb&textColor=ffffff",
    conversationCreatedAt: new Date(
      Date.now() - 24 * 2 * HOUR,
    ).toISOString(),
    lastMessagePreview: "Anh cho em xin mã vé ạ, em hỗ trợ đổi luôn nhé.",
    lastMessageAt: new Date(Date.now() - 1.2 * HOUR).toISOString(),
    unreadCount: 0,
    type: "OPERATOR",
    toUser: {
      userId: 102,
      fullName: "Thiên Long",
      username: "thienlong",
      avatarUrl:
        "https://api.dicebear.com/7.x/initials/svg?seed=TL&backgroundColor=2563eb&textColor=ffffff",
      email: "cskh@thienlong.vn",
      role: "OPERATOR",
    },
    participants: mockParticipants(false, false),
  },
  {
    conversationId: 3,
    conversationName: "Hỗ trợ khách hàng GoRide",
    conversationAvatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=GR&backgroundColor=16a34a&textColor=ffffff",
    conversationCreatedAt: new Date(
      Date.now() - 24 * 5 * HOUR,
    ).toISOString(),
    lastMessagePreview: "Cảm ơn anh đã phản hồi, em sẽ kiểm tra ngay.",
    lastMessageAt: new Date(Date.now() - 24 * 0.8 * HOUR).toISOString(),
    unreadCount: 0,
    type: "ADMIN",
    toUser: {
      userId: 999,
      fullName: "Đội hỗ trợ GoRide",
      username: "admin",
      avatarUrl:
        "https://api.dicebear.com/7.x/initials/svg?seed=GR&backgroundColor=16a34a&textColor=ffffff",
      email: "admin@goride.vn",
      role: "ADMIN",
    },
    participants: mockParticipants(false, true),
  },
];

const operatorTemplates: ConversationResponseDto[] = [
  {
    conversationId: 11,
    conversationName: "Hoàng Long — Hỗ trợ 24/7",
    conversationAvatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=HL&backgroundColor=16a34a&textColor=ffffff",
    conversationCreatedAt: new Date(
      Date.now() - 24 * 30 * HOUR,
    ).toISOString(),
    lastMessagePreview: "Hệ thống sẵn sàng phục vụ quý khách 24/7.",
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
    type: "OPERATOR",
    toUser: {
      userId: 103,
      fullName: "Hoàng Long",
      username: "hoanglong",
      avatarUrl:
        "https://api.dicebear.com/7.x/initials/svg?seed=HL&backgroundColor=16a34a&textColor=ffffff",
      email: "support@hoanglong.vn",
      role: "OPERATOR",
    },
    participants: mockParticipants(false, false),
  },
  {
    conversationId: 12,
    conversationName: "Kumho Samco — Hỗ trợ vé",
    conversationAvatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=KS&backgroundColor=7c3aed&textColor=ffffff",
    conversationCreatedAt: new Date(
      Date.now() - 24 * 14 * HOUR,
    ).toISOString(),
    lastMessagePreview: "Cảm ơn quý khách đã sử dụng dịch vụ.",
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
    type: "OPERATOR",
    toUser: {
      userId: 104,
      fullName: "Kumho Samco",
      username: "kumhosamco",
      avatarUrl:
        "https://api.dicebear.com/7.x/initials/svg?seed=KS&backgroundColor=7c3aed&textColor=ffffff",
      email: "support@kumhosamco.vn",
      role: "OPERATOR",
    },
    participants: mockParticipants(false, false),
  },
  {
    conversationId: 13,
    conversationName: "Cúc Tùng — Hỗ trợ vé",
    conversationAvatar:
      "https://api.dicebear.com/7.x/initials/svg?seed=CT&backgroundColor=ea580c&textColor=ffffff",
    conversationCreatedAt: new Date(
      Date.now() - 24 * 60 * HOUR,
    ).toISOString(),
    lastMessagePreview: "Chuyến đi của quý khách đã được ghi nhận.",
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
    type: "OPERATOR",
    toUser: {
      userId: 105,
      fullName: "Cúc Tùng",
      username: "cuctung",
      avatarUrl:
        "https://api.dicebear.com/7.x/initials/svg?seed=CT&backgroundColor=ea580c&textColor=ffffff",
      email: "support@cuctung.vn",
      role: "OPERATOR",
    },
    participants: mockParticipants(false, false),
  },
];

const seedMessages: Record<number, MessageResponseDto[]> = {
  1: [
    {
      id: 901,
      conversationId: 1,
      senderId: 101,
      senderName: "Phương Trang Futa",
      senderAvatarUrl:
        "https://api.dicebear.com/7.x/initials/svg?seed=PT&backgroundColor=e63946&textColor=ffffff",
      content:
        "Xin chào anh/chị, em là nhân viên hỗ trợ của Phương Trang ạ.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(Date.now() - 24 * 2 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 2 * HOUR).toISOString(),
    },
    {
      id: 902,
      conversationId: 1,
      senderId: 1,
      senderName: "Bạn",
      senderAvatarUrl: "",
      content:
        "Chào em, anh vừa đặt chuyến HN → ĐN lúc 14:30 ngày mai, kiểm tra giúp anh với.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(Date.now() - 24 * 2 * HOUR + 5 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 2 * HOUR + 5 * 60 * 1000).toISOString(),
    },
    {
      id: 903,
      conversationId: 1,
      senderId: 101,
      senderName: "Phươơng Trang Futa",
      senderAvatarUrl:
        "https://api.dicebear.com/7.x/initials/svg?seed=PT&backgroundColor=e63946&textColor=ffffff",
      content:
        "Dạ em xác nhận chuyến PT-HN-DN-2031 đã được ghi nhận. Anh nhớ có mặt tại bến Mỹ Đình trước 14:00 ạ.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(Date.now() - 24 * 1.5 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 1.5 * HOUR).toISOString(),
    },
    {
      id: 904,
      conversationId: 1,
      senderId: 101,
      senderName: "Phương Trang Futa",
      senderAvatarUrl:
        "https://api.dicebear.com/7.x/initials/svg?seed=PT&backgroundColor=e63946&textColor=ffffff",
      content: "Chuyến HN → ĐN đã được xác nhận.",
      type: "TEXT",
      status: "DELIVERED",
      attachments: [],
      createdAt: new Date(Date.now() - 0.25 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 0.25 * HOUR).toISOString(),
    },
  ],
  2: [
    {
      id: 801,
      conversationId: 2,
      senderId: 102,
      senderName: "Thiên Long",
      senderAvatarUrl:
        "https://api.dicebear.com/7.x/initials/svg?seed=TL&backgroundColor=2563eb&textColor=ffffff",
      content:
        "Chào anh, em nhận được yêu cầu đổi vé từ hệ thống. Anh cho em xin mã vé ạ.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(Date.now() - 2.5 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 2.5 * HOUR).toISOString(),
    },
  ],
  3: [
    {
      id: 701,
      conversationId: 3,
      senderId: 999,
      senderName: "Đội hỗ trợ GoRide",
      senderAvatarUrl:
        "https://api.dicebear.com/7.x/initials/svg?seed=GR&backgroundColor=16a34a&textColor=ffffff",
      content:
        "Cảm ơn anh đã phản hồi, em sẽ kiểm tra ngay.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(Date.now() - 24 * 0.8 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 0.8 * HOUR).toISOString(),
    },
  ],
};

// ─── Public API ─────────────────────────────────────────────────────────
export const listMockConversations = (): ConversationResponseDto[] => {
  return [...mockConversations].sort(
    (a, b) =>
      new Date(b.lastMessageAt ?? 0).getTime() -
      new Date(a.lastMessageAt ?? 0).getTime(),
  );
};

export const listMockOperators = (): ConversationResponseDto[] =>
  operatorTemplates;

export const getMockConversationDetail = (
  id: number | string,
): ConversationResponseDto | null => {
  const found = mockConversations.find(
    (item) => String(item.conversationId) === String(id),
  );
  return found ?? null;
};

export const buildMockMessages = (
  conversationId: number | string,
  params: GetMessagesParams,
): MessageResponseDto[] => {
  const seed = seedMessages[Number(conversationId)] ?? [];
  const total = params.limit ?? 20;
  return seed.slice(0, total);
};

let nextMessageId = 10000;
let nextConversationId = 100;

export const pushMockMessage = (
  payload: SendMessagePayloadDto,
): MessageResponseDto => {
  nextMessageId += 1;
  const id = nextMessageId;
  return {
    id,
    conversationId: payload.conversationId,
    senderId: 1,
    senderName: "Bạn",
    senderAvatarUrl: "",
    content: payload.content,
    type: "TEXT",
    status: "SENT",
    attachments: payload.attachments ?? [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const resolveMockConversationId = (): number => {
  nextConversationId += 1;
  return nextConversationId;
};

export const toggleMockPin = (
  conversationId: number | string,
  isPinned: boolean,
) => {
  const conv = mockConversations.find(
    (item) => String(item.conversationId) === String(conversationId),
  );
  if (!conv) return;
  conv.participants = conv.participants.map((p) =>
    p.userId === 1 ? { ...p, isPinned } : p,
  );
};

export const toggleMockMute = (
  conversationId: number | string,
  preset: MuteConversationPreset,
) => {
  const conv = mockConversations.find(
    (item) => String(item.conversationId) === String(conversationId),
  );
  if (!conv) return;
  const mutedUntil =
    preset === "no end time yet"
      ? undefined
      : new Date(
          Date.now() +
            (preset === "15m"
              ? 15 * 60 * 1000
              : preset === "1h"
                ? HOUR
                : preset === "8h"
                  ? 8 * HOUR
                  : 24 * HOUR),
        ).toISOString();
  conv.participants = conv.participants.map((p) =>
    p.userId === 1
      ? { ...p, isMuted: true, mutedUntil }
      : p,
  );
};

export const toggleMockNickname = (
  conversationId: number | string,
  nickname: string | null,
) => {
  const conv = mockConversations.find(
    (item) => String(item.conversationId) === String(conversationId),
  );
  if (!conv) return;
  conv.participants = conv.participants.map((p) =>
    p.userId === 1
      ? { ...p, nickname: nickname ?? undefined }
      : p,
  );
  if (nickname) {
    conv.conversationName = nickname;
  }
};
