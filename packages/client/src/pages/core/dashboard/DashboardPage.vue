<template>
  <div class="dashboard-container">
    <va-progress-bar v-if="isInitialisingTelegram" indeterminate />

    <template v-if="!isInitialisingTelegram">
      <Navbar @show-sidebar="onToggleSidebar()" />

      <div class="h-full w-full flex flex-row">
        <Sidebar
          :showSidebar="showSidebar"
          @toggle-sidebar="onToggleSidebar()"
        />

        <div class="h-full w-full px-2 pt-16">
          <template v-if="isCurrentRouteDashboardOnly">
            <va-alert v-if="!isLoggedIntoTelegramComputed" dense color="danger">
              You need to connect your telegram account in the settings.
            </va-alert>

            <div
              v-if="isLoggedIntoTelegramComputed"
              class="link-cards-container"
            >
              <va-card class="link-card">
                <router-link
                  :to="`/${RoutePaths.DASHBOARD}/${RoutePaths.CHATS}`"
                >
                  <va-card-content
                    >View Chats, Channels & Groups</va-card-content
                  >
                </router-link>
              </va-card>

              <va-card class="link-card">
                <router-link
                  :to="`/${RoutePaths.DASHBOARD}/${RoutePaths.CHAT_AUTOMATIONS}`"
                >
                  <va-card-content>Chat Automations</va-card-content>
                </router-link>
              </va-card>
            </div>
          </template>

          <router-view></router-view>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, watch } from "vue";
import { useRoute, RouteLocationNormalizedLoaded } from "vue-router";
import { Store, useStore } from "vuex";

import _ from "lodash";
import { VaCard, VaCardContent, VaProgressBar, VaAlert } from "vuestic-ui";
import { Api } from "telegram";

import { LoggerUtils } from "@shared-core";

import { StoreStateType } from "@/store";
import { TelegramStoreActions } from "@/store/modules/telegram.store";
import { ITelegramChatsService } from "@/services/telegram/chats/i-telegram-chats.service";
import { ITelegramAuthService } from "@/services/telegram/auth/i-telegram-auth.service";
import { ServiceProviderKeys } from "@/services/service-provider-keys";
import { ITelegramChatsAutomationDaoService } from "@/services/telegram/chats/i-telegram-chats-automation-dao.service";
import { RoutePaths } from "@/constants/route-paths";
import Navbar from "@/components/core/Navbar.vue";
import Sidebar from "@/components/core/Sidebar.vue";

const route: RouteLocationNormalizedLoaded = useRoute();
const store: Store<StoreStateType> = useStore();

const telegramAuthService: ITelegramAuthService = inject(
  ServiceProviderKeys.TELEGRAM_AUTH_SERVICE
);

const telegramChatsService: ITelegramChatsService = inject(
  ServiceProviderKeys.TELEGRAM_CHATS_SERVICE
);

const telegramChatsAutomationDaoService: ITelegramChatsAutomationDaoService =
  inject(ServiceProviderKeys.TELEGRAM_CHATS_AUTOMATION_SERVICE);

const isLoggedIntoTelegramComputed = computed(
  () => store.state.telegramStore.isLoggedIn
);

const isInitialisingTelegram = ref<boolean>(false);
const showSidebar = ref<boolean>(false);

const currentRoutePath = ref<string>(route.path);

const isCurrentRouteDashboardOnly = computed<boolean>(() =>
  _.isEqual(currentRoutePath.value, `/${RoutePaths.DASHBOARD}`)
);

async function initialise(): Promise<void> {
  try {
    isInitialisingTelegram.value = true;

    await telegramAuthService.initialise();

    if (_.isEmpty(store.state.telegramStore.chats)) {
      await fetchChats();
    }

    fetchChatAutomations();
    isInitialisingTelegram.value = false;
  } catch (error) {
    LoggerUtils.error("DashboardPage", "initialise", error);
  }
}

async function watchChatUpdates(update: Api.TypeUpdate): Promise<void> {
  if (
    _.isEqual(update.className, "UpdateReadHistoryInbox") ||
    _.isEqual(update.className, "UpdateReadHistoryOutbox")
  ) {
    await fetchChats();
  }
}

async function fetchChats(): Promise<void> {
  try {
    const chats = await telegramChatsService.getAllChats();
    await store.dispatch(TelegramStoreActions.UPDATE_TELEGRAM_CHATS, chats);
  } catch (error) {
    LoggerUtils.error("DashboardPage", "fetchChats", error);
  }
}

async function fetchChatAutomations(): Promise<void> {
  try {
    const chatAutomations = await telegramChatsAutomationDaoService.getAll();

    await store.dispatch(
      TelegramStoreActions.UPDATE_TELEGRAM_CHAT_AUTOMATIONS,
      chatAutomations
    );
  } catch (error) {
    LoggerUtils.error("DashboardPage", "fetchChatAutomations", error);
  }
}

function onToggleSidebar(): void {
  showSidebar.value = !showSidebar.value;
}

watch(route, (newRoute: RouteLocationNormalizedLoaded) => {
  currentRoutePath.value = newRoute.path;
});

initialise();
</script>

<style lang="scss" scoped>
.dashboard-container {
  @apply h-full w-full overflow-auto;

  .link-cards-container {
    @apply p-2;

    .va-card.link-card {
      &:not(:last-child) {
        @apply mb-2;
      }

      .link-card-title {
        @apply text-lg font-bold text-black;
      }
    }
  }
}
</style>
