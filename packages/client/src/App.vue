<template>
  <div class="app-inner-container">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import { provide } from "vue";

import { ServiceProviderKeys } from "./services/service-provider-keys";
import { ITelegramAuthService } from "./services/telegram/auth/i-telegram-auth.service";
import { TelegramAuthService } from "./services/telegram/auth/telegram-auth.service";
import { ITelegramChatsService } from "./services/telegram/chats/i-telegram-chats.service";
import { TelegramChatsService } from "./services/telegram/chats/telegram-chats.service";
import { ITelegramChatsAutomationDaoService } from "./services/telegram/chats/i-telegram-chats-automation-dao.service";
import { IAuthService } from "./services/auth/i-auth.service";
import { AuthService } from "./services/auth/auth.service";
import { IHttpService } from "./services/http/i-http.service";
import { AxiosHttpService } from "./services/http/axios-http.service";
import { ApiTelegramChatsAutomationDaoService } from "./services/telegram/chats/api-telegram-chats-automation-dao.service";

// --------------------------
// Injecting Dependencies
// --------------------------

const httpService: IHttpService = new AxiosHttpService();
const authService: IAuthService = new AuthService(httpService);

const telegramAuthService: ITelegramAuthService = new TelegramAuthService(
  httpService
);

const telegramChatsService: ITelegramChatsService = new TelegramChatsService(
  telegramAuthService as TelegramAuthService
);

const telegramChatsAutomationDaoService: ITelegramChatsAutomationDaoService =
  new ApiTelegramChatsAutomationDaoService(httpService);

provide(ServiceProviderKeys.AUTH_SERVICE, authService);

provide(ServiceProviderKeys.TELEGRAM_AUTH_SERVICE, telegramAuthService);
provide(ServiceProviderKeys.TELEGRAM_CHATS_SERVICE, telegramChatsService);
provide(
  ServiceProviderKeys.TELEGRAM_CHATS_AUTOMATION_SERVICE,
  telegramChatsAutomationDaoService
);

// --------------------------
</script>

<style lang="scss">
#app {
  @apply h-full w-full;

  .app-inner-container {
    @apply h-full w-full;
  }
}
</style>
