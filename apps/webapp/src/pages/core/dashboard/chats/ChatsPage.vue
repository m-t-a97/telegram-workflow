<script lang="ts" setup>
import { inject, onMounted, reactive, ref } from "vue";
import { Store, useStore } from "vuex";

import { Api } from "telegram";
import _ from "lodash";
import { VaProgressCircle, VaAlert } from "vuestic-ui";

import { LoggerUtils } from "@/shared-core";

import { StoreStateType } from "@/store/index";
import { TelegramStoreActions } from "@/store/modules/telegram.store";
import ChatsList from "@/components/chats/ChatsList.vue";
import { ITelegramChatsService } from "@/services/telegram/chats/i-telegram-chats.service";
import { ServiceProviderKeys } from "@/services/service-provider-keys";

const store: Store<StoreStateType> = useStore();

const telegramChatsService: ITelegramChatsService = inject(
  ServiceProviderKeys.TELEGRAM_CHATS_SERVICE
);

const isLoadingChats = ref<boolean>(false);
const errorMessage = ref<string>("");
const chatsProxy = reactive<{ chats: Api.Chat[] }>({ chats: [] });

async function fetchChats(): Promise<void> {
  try {
    errorMessage.value = "";
    isLoadingChats.value = true;

    const fetchedChats = await telegramChatsService.getAll();
    chatsProxy.chats = fetchedChats;

    await store.dispatch(
      TelegramStoreActions.UPDATE_TELEGRAM_CHATS,
      chatsProxy.chats
    );

    isLoadingChats.value = false;
  } catch (error) {
    LoggerUtils.error("ChatsPage", "fetchChats", error);
    isLoadingChats.value = false;
    errorMessage.value = error.message;
  }
}

onMounted(() => {
  if ((store.state as StoreStateType).telegramStore.isLoggedIn) {
    fetchChats();
  }
});
</script>

<template>
  <div class="h-full w-full p-4">
    <div v-if="isLoadingChats" class="h-full w-full flex flex-row justify-center items-start">
      <va-progress-circle indeterminate size="small" :thickness="0.3" :value="50" color="#FFFFFF" />
    </div>

    <template v-if="!isLoadingChats">
      <template v-if="_.isEmpty(errorMessage) && !_.isEmpty(chatsProxy.chats)">
        <h1 class="w-fit-content mx-auto mb-4 px-2 py-1 rounded-md text-2xl font-bold bg-white">All Chats</h1>
        <ChatsList :chats="chatsProxy.chats" />
      </template>

      <h1 v-if="_.isEmpty(errorMessage) && _.isEmpty(chatsProxy.chats)"
        class="w-fit-content mx-auto mb-4 px-2 py-1 rounded-md text-2xl font-bold bg-white">
        You currently have no chats...
      </h1>

      <va-alert v-if="!_.isEmpty(errorMessage)" color="danger">
        {{ errorMessage }}
      </va-alert>
    </template>
  </div>
</template>

