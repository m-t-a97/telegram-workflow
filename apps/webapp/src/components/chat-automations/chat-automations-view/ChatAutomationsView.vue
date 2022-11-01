<template>
  <div class="chat-automations-view-container">
    <div v-if="isFetchingChatAutomations" class="h-full w-full flex flex-row justify-center items-start">
      <va-progress-circle indeterminate size="small" :thickness="0.3" :value="50" color="#FFFFFF" />
    </div>

    <div v-if="!isFetchingChatAutomations">
      <ChatAutomationsViewActionButtons :chatAutomationsToggleStateMap="chatAutomationsToggleStateMap"
        :haveChatAutomationsBeenSelectedForDeletion="
          haveChatAutomationsBeenSelectedForDeletion
        " @toggle-all-chat-automations="onToggleAllChatAutomations($event)"
        @creating-new-automation="onCreatingNewAutomation()" @deleting-chat-automations="onDeletingChatAutomations()"
        @chat-automations-deleted="onDeletedChatAutomations()" />

      <ChatAutomationsViewList :chatAutomations="chatAutomations"
        :chatAutomationsToggleStateMap="chatAutomationsToggleStateMap"
        :isChatAutomationsBeingDeleted="isChatAutomationsBeingDeleted" @list-item-toggled="onListItemToggled($event)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, inject } from "vue";
import { Store, useStore } from "vuex";

import { VaProgressCircle } from "vuestic-ui";

import { ChatAutomation, LoggerUtils } from "@/shared-core";

import { StoreStateType } from "@/store";
import ChatAutomationsViewActionButtons from "../chat-automations-view/ChatAutomationsViewActionButtons.vue";
import ChatAutomationsViewList from "../chat-automations-view/ChatAutomationsViewList.vue";
import { ServiceProviderKeys } from "@/services/service-provider-keys";
import { ITelegramChatAutomationsDaoService } from "@/services/telegram/chats/i-telegram-chat-automations-dao.service";

const store: Store<StoreStateType> = useStore();

const telegramChatsAutomationDaoService: ITelegramChatAutomationsDaoService =
  inject(ServiceProviderKeys.TELEGRAM_CHATS_AUTOMATION_SERVICE);

const isFetchingChatAutomations = ref<boolean>(false);
const isCreatingNewAutomation = ref<boolean>(false);
const isChatAutomationsBeingDeleted = ref<boolean>(false);
const haveChatAutomationsBeenSelectedForDeletion = ref<boolean>(false);
const chatAutomationsToggleStateMap = ref<Record<string, boolean>>({});
const chatAutomations = ref<ChatAutomation[]>([]);

const storeChatAutomationsComputed = computed(
  () => store.state.telegramStore.chatAutomations
);

async function fetchChatAutomations(): Promise<void> {
  try {
    isFetchingChatAutomations.value = true;
    const chatAutomationsFetched =
      await telegramChatsAutomationDaoService.getAll();
    chatAutomations.value = chatAutomationsFetched;
    storeReferenceToAllAutomationsInsideToggleMap();
    isFetchingChatAutomations.value = false;
  } catch (error) {
    LoggerUtils.error("ChatAutomationsView", "fetchChatAutomations", error);
  }
}

function storeReferenceToAllAutomationsInsideToggleMap(): void {
  for (const automation of chatAutomations.value) {
    chatAutomationsToggleStateMap.value[automation.id] = false;
  }
}

function onToggleAllChatAutomations(newValue: boolean): void {
  for (const key of Object.keys(chatAutomationsToggleStateMap.value)) {
    chatAutomationsToggleStateMap.value[key] = newValue;
  }
}

async function onCreatingNewAutomation(): Promise<void> {
  isCreatingNewAutomation.value = true;
}

function onDeletingChatAutomations(): void {
  isChatAutomationsBeingDeleted.value = true;
}

function onDeletedChatAutomations(): void {
  isChatAutomationsBeingDeleted.value = false;
  chatAutomations.value = storeChatAutomationsComputed.value;
}

function onListItemToggled(data: { id: string; value: boolean }): void {
  chatAutomationsToggleStateMap.value[data.id] = data.value;
}

function watchForChanges(): void {
  watchStoreChatAutomations();
  watchForTogglingOfIndividualChatAutomation();
}

function watchStoreChatAutomations(): void {
  watch(
    storeChatAutomationsComputed,
    (updatedAutomations: ChatAutomation[]) => {
      if (
        !isCreatingNewAutomation.value &&
        !isChatAutomationsBeingDeleted.value
      ) {
        chatAutomations.value = updatedAutomations;
        storeReferenceToAllAutomationsInsideToggleMap();
      }
    }
  );
}

function watchForTogglingOfIndividualChatAutomation(): void {
  watch(chatAutomationsToggleStateMap, () => {
    let automationsHaveBeenSelectedForDeletion = false;

    for (const key of Object.keys(chatAutomationsToggleStateMap.value)) {
      if (chatAutomationsToggleStateMap.value[key]) {
        automationsHaveBeenSelectedForDeletion = true;
        break;
      }
    }

    haveChatAutomationsBeenSelectedForDeletion.value =
      automationsHaveBeenSelectedForDeletion;
  });
}

fetchChatAutomations();
watchForChanges();
</script>

<style lang="scss" scoped>
.chat-automations-view-container {
  .chat-automations-list {
    @apply mt-4 p-0 rounded-md bg-white;
  }
}
</style>
