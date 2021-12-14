<template>
  <div class="dashboard-page-container">
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
                  <va-card-content class="text-black text-base font-bold"
                    >View Chats, Channels & Groups</va-card-content
                  >
                </router-link>
              </va-card>

              <va-card class="link-card">
                <router-link
                  :to="`/${RoutePaths.DASHBOARD}/${RoutePaths.CHAT_AUTOMATIONS}`"
                >
                  <va-card-content class="text-black text-base font-bold"
                    >Chat Automations</va-card-content
                  >
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
import { computed, inject, ref, watchEffect } from "vue";
import { useRoute, RouteLocationNormalizedLoaded } from "vue-router";
import { Store, useStore } from "vuex";

import _ from "lodash";
import { VaCard, VaCardContent, VaProgressBar, VaAlert } from "vuestic-ui";

import { LoggerUtils } from "@shared-core";

import { StoreStateType } from "@/store";
import { TelegramStoreActions } from "@/store/modules/telegram.store";
import { ServiceProviderKeys } from "@/services/service-provider-keys";
import { RoutePaths } from "@/constants/route-paths";
import Navbar from "@/components/core/Navbar.vue";
import Sidebar from "@/components/core/Sidebar.vue";
import { IHttpService } from "@/services/http/i-http.service";
import { APIEndpoints } from "@/constants/api-endpoints";

const route: RouteLocationNormalizedLoaded = useRoute();
const store: Store<StoreStateType> = useStore();

const httpService: IHttpService = inject(ServiceProviderKeys.HTTP_SERVICE);

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

async function initialise(): Promise<void> {
  try {
    isInitialisingTelegram.value = true;

    const isAuthorised = await httpService.get(
      APIEndpoints.TELEGRAM_AUTH_IS_AUTHORISED
    );

    await store.dispatch(
      TelegramStoreActions.UPDATE_IS_LOGGED_INTO_TELEGRAM,
      isAuthorised
    );

    await fetchChats();
    isInitialisingTelegram.value = false;
  } catch (error) {
    LoggerUtils.error("DashboardPage", "initialise", error);
  }
}

async function fetchChats(): Promise<void> {
  try {
    const chats = await httpService.get(APIEndpoints.CHATS);
    await store.dispatch(TelegramStoreActions.UPDATE_TELEGRAM_CHATS, chats);
  } catch (error) {
    LoggerUtils.error("DashboardPage", "fetchChats", error);
  }
}

function onToggleSidebar(): void {
  showSidebar.value = !showSidebar.value;
}

watchEffect(() => {
  currentRoutePath.value = route.path;

  const isChatAutomationWorkflowPath =
    route.path.indexOf(RoutePaths.CHAT_AUTOMATION_WORKFLOW) !== -1;

  if (isChatAutomationWorkflowPath) {
    isNavbarVisible.value = false;
  } else {
    isNavbarVisible.value = true;
  }
});

initialise();
</script>

<style lang="scss" scoped>
.dashboard-page-container {
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
