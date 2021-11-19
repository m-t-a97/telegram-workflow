<template>
  <div class="dashboard-container">
    <va-progress-bar v-if="isInitialisingTelegram" indeterminate />

    <template v-if="!isInitialisingTelegram">
      <Navbar v-show="isNavbarVisible" @show-sidebar="onToggleSidebar()" />

      <div class="h-full w-full flex flex-row">
        <Sidebar
          v-show="isNavbarVisible"
          :showSidebar="showSidebar"
          @toggle-sidebar="onToggleSidebar()"
        />

        <div class="h-full w-full" :class="{ 'px-2 pt-16': isNavbarVisible }">
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
import { computed, inject, onUnmounted, ref, watchEffect } from "vue";
import { useRoute, RouteLocationNormalizedLoaded } from "vue-router";
import { Store, useStore } from "vuex";

import _ from "lodash";
import { VaCard, VaCardContent, VaProgressBar, VaAlert } from "vuestic-ui";
import { Api } from "telegram";
import { catchError, of, Subscription, tap } from "rxjs";

import { LoggerUtils, RxjsHelperUtils } from "@shared-core";

import { StoreStateType } from "@/store";
import { TelegramStoreActions } from "@/store/modules/telegram.store";
import { ITelegramChatsService } from "@/services/telegram/chats/i-telegram-chats.service";
import { ITelegramAuthService } from "@/services/telegram/auth/i-telegram-auth.service";
import { ServiceProviderKeys } from "@/services/service-provider-keys";
import { ITelegramChatsAutomationDaoService } from "@/services/telegram/chats/i-telegram-chats-automation-dao.service";
import { RoutePaths } from "@/constants/route-paths";
import Navbar from "@/components/core/Navbar.vue";
import Sidebar from "@/components/core/Sidebar.vue";
import { EventsService } from "@/services/events/events.service";

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

const isNavbarVisible = ref<boolean>(false);
const isInitialisingTelegram = ref<boolean>(false);
const showSidebar = ref<boolean>(false);

const currentRoutePath = ref<string>(route.path);

const isCurrentRouteDashboardOnly = computed<boolean>(() =>
  _.isEqual(currentRoutePath.value, `/${RoutePaths.DASHBOARD}`)
);

let chatAutomationsUpdater_$: Subscription;

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

function fetchChatAutomations(): void {
  chatAutomationsUpdater_$ = EventsService.chatAutomationsUpdater$
    .pipe(
      tap(async () => {
        const chatAutomations =
          await telegramChatsAutomationDaoService.getAll();

        await store.dispatch(
          TelegramStoreActions.UPDATE_TELEGRAM_CHAT_AUTOMATIONS,
          chatAutomations
        );
      }),
      catchError((error: any) => {
        LoggerUtils.error("DashboardPage", "fetchChatAutomations", error);

        return of(null);
      })
    )
    .subscribe();

  EventsService.chatAutomationsUpdater$.next();
}

function onToggleSidebar(): void {
  showSidebar.value = !showSidebar.value;
}

onUnmounted(() => {
  RxjsHelperUtils.unsubscribe(chatAutomationsUpdater_$);
});

watchEffect(() => {
  currentRoutePath.value = route.path;

  if (route.path.indexOf(RoutePaths.CHAT_AUTOMATION_WORKFLOW) !== -1) {
    isNavbarVisible.value = false;
  } else {
    isNavbarVisible.value = true;
  }
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
