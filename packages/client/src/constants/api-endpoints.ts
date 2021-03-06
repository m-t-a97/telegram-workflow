export enum APIEndpoints {
  AUTH_VERIFY_API_KEY = "api/auth/verify-api-key",
  AUTH_FETCH_API_CREDENTIALS = "api/auth/fetch-api-credentials",

  TELEGRAM_AUTH_IS_AUTHORISED = "api/telegram-auth/is-authorised",
  TELEGRAM_AUTH_SEND_CODE = "api/telegram-auth/send-code",
  TELEGRAM_AUTH_SIGN_IN = "api/telegram-auth/sign-in",
  TELEGRAM_AUTH_SIGN_IN_WITH_TWO_FACTOR = "api/telegram-auth/sign-in-with-two-factor",

  CHATS = "api/chats",

  CHAT_AUTOMATIONS = "api/chat-automations",
  CHAT_AUTOMATIONS_CREATE = "api/chat-automations/create",
  CHAT_AUTOMATIONS_ACTIVATE = "api/chat-automations/activate",
  CHAT_AUTOMATIONS_DEACTIVATE = "api/chat-automations/deactivate",
}
