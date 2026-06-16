export const ConverationEndpoint = {
  CHAT_CONVERSATIONS: "/chat/conversations",
  CHAT_CONVERSATION_DETAIL: (id: number | string) => `/chat/conversations/${id}`,
  CHAT_MESSAGES: "/chat/messages",
  CHAT_CONVERSATION_MESSAGES: (id: number | string) =>
    `/chat/conversations/${id}/messages`,
  CHAT_SEND_MESSAGE: "/chat/messages",
  CHAT_SET_NICKNAME: (id: number | string) =>
    `/chat/conversations/${id}/nickname`,
  CHAT_PIN: (id: number | string) => `/chat/conversations/${id}/pin`,
  CHAT_MUTE: (id: number | string) => `/chat/conversations/${id}/mute`,
  CHAT_MARK_READ: (id: number | string) => `/chat/conversations/${id}/read`,
  CHAT_OPERATOR_HOTLINE: "/chat/operators",
  CHAT_ADMIN_HOTLINE: "/chat/admin",
  CHAT_UPLOAD_ATTACHMENT: "/chat/attachments",
} as const;

export const CHAT_QUERY_KEYS = {
  CONVERSATIONS: "GET_CHAT_CONVERSATION",
  CONVERSATION_DETAIL: "GET_CHAT_CONVERSATION_DETAIL",
  CONVERSATION_MESSAGES: "GET_CHAT_CONVERSATION_MESSAGE",
  OPERATORS: "GET_CHAT_OPERATORS",
} as const;
