import axiosClient from "../axiosClient";
import type {
  ConversationResponseDto,
  CreateConversationDto,
  GetMessagesParams,
  MessageResponseDto,
  MuteConversationDto,
  PinConversationDto,
  SendMessagePayloadDto,
  SetNicknameDto,
} from "../dtos/chat.dto";
import {
  CHAT_QUERY_KEYS,
  ConverationEndpoint,
} from "../endpoints/chat.endpoint";
import { isAxiosError } from "axios";
import {
  buildMockMessages,
  getMockConversationDetail,
  listMockConversations,
  listMockOperators,
  pushMockMessage,
  resolveMockConversationId,
  toggleMockMute,
  toggleMockNickname,
  toggleMockPin,
} from "./mocks/chat.mock";

// ─── Mock fallback (khi backend chưa có endpoint) ────────────────────────
export const USE_MOCK = false;

const tryRealOrMock = async <T>(
  real: () => Promise<T>,
  fallback: () => T,
): Promise<T> => {
  if (USE_MOCK) return fallback();
  try {
    return await real();
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return fallback();
    }
    throw error;
  }
};

// ─── Conversations ──────────────────────────────────────────────────────
export const getChatConversations = async (): Promise<
  ConversationResponseDto[]
> => {
  return tryRealOrMock(
    async () => {
      const response = await axiosClient.get<ConversationResponseDto[]>(
        ConverationEndpoint.CHAT_CONVERSATIONS,
      );
      return response.data;
    },
    () => listMockConversations(),
  );
};

export const getChatConversationDetail = async (
  id: number | string,
): Promise<ConversationResponseDto | null> => {
  return tryRealOrMock(
    async () => {
      const response = await axiosClient.get<ConversationResponseDto>(
        ConverationEndpoint.CHAT_CONVERSATION_DETAIL(id),
      );
      return response.data;
    },
    () => getMockConversationDetail(id),
  );
};

export const createChatConversation = async (
  payload: CreateConversationDto,
): Promise<ConversationResponseDto> => {
  if (USE_MOCK) {
    const newId = resolveMockConversationId();
    return {
      conversationId: newId,
      conversationName: `Hỗ trợ mới #${newId}`,
      conversationAvatar: "",
      conversationCreatedAt: new Date().toISOString(),
      lastMessagePreview: payload.initialMessage ?? "",
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
      type: payload.type,
      participants: [
        {
          userId: 999,
          isPinned: false,
          isMuted: false,
        },
      ],
    };
  }

  const response = await axiosClient.post<ConversationResponseDto>(
    ConverationEndpoint.CHAT_CONVERSATIONS,
    payload,
  );
  return response.data;
};

// ─── Messages ───────────────────────────────────────────────────────────
export const getConversationMessages = async (
  conversationId: number | string,
  params: GetMessagesParams,
): Promise<MessageResponseDto[]> => {
  return tryRealOrMock(
    async () => {
      const response = await axiosClient.get<{ data: MessageResponseDto[] }>(
        ConverationEndpoint.CHAT_CONVERSATION_MESSAGES(conversationId),
        { params },
      );
      return response.data.data;
    },
    () => buildMockMessages(conversationId, params),
  );
};

export const sendChatMessage = async (
  payload: SendMessagePayloadDto,
): Promise<MessageResponseDto> => {
  if (USE_MOCK) {
    return pushMockMessage(payload);
  }

  const response = await axiosClient.post<MessageResponseDto>(
    ConverationEndpoint.CHAT_SEND_MESSAGE,
    payload,
  );
  return response.data;
};

export const markConversationAsRead = async (
  conversationId: number | string,
  messageId?: number,
): Promise<void> => {
  if (USE_MOCK) return;
  await axiosClient.post(ConverationEndpoint.CHAT_MARK_READ(conversationId), {
    messageId,
  });
};

// ─── Conversation actions (nickname, pin, mute) ─────────────────────────
export const setConversationNickname = async (
  payload: SetNicknameDto,
): Promise<void> => {
  if (USE_MOCK) {
    toggleMockNickname(payload.conversationId, payload.nickname);
    return;
  }
  await axiosClient.patch(
    ConverationEndpoint.CHAT_SET_NICKNAME(payload.conversationId),
    { nickname: payload.nickname },
  );
};

export const pinConversation = async (
  payload: PinConversationDto,
): Promise<void> => {
  if (USE_MOCK) {
    toggleMockPin(payload.conversationId, payload.isPinned);
    return;
  }
  await axiosClient.patch(
    ConverationEndpoint.CHAT_PIN(payload.conversationId),
    { isPinned: payload.isPinned },
  );
};

export const muteConversation = async (
  payload: MuteConversationDto,
): Promise<void> => {
  if (USE_MOCK) {
    toggleMockMute(payload.conversationId, payload.preset);
    return;
  }
  await axiosClient.patch(
    ConverationEndpoint.CHAT_MUTE(payload.conversationId),
    { preset: payload.preset },
  );
};

// ─── Hotlines (operator/admin) ──────────────────────────────────────────
export const getOperatorHotlines = async (): Promise<
  ConversationResponseDto[]
> => {
  return tryRealOrMock(
    async () => {
      const response = await axiosClient.get<ConversationResponseDto[]>(
        ConverationEndpoint.CHAT_OPERATOR_HOTLINE,
      );
      return response.data;
    },
    () => listMockOperators(),
  );
};

export { CHAT_QUERY_KEYS };
