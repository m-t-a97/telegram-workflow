<template>
  <div class="chat-automations-view-action-buttons-container">
    <va-button-group outline :rounded="false">
      <va-button
        v-if="chatAutomations.length > 0 || isChatAutomationsBeingDeleted"
        :rounded="false"
        :loading="isChatAutomationsBeingDeleted"
        :disabled="
          isNewAutomationCreationInProgress || isChatAutomationsBeingDeleted
        "
      >
        <va-checkbox v-model="isCheckboxChecked" color="#000000" />
      </va-button>

      <va-button
        v-if="chatAutomations.length > 0 || isChatAutomationsBeingDeleted"
        color="#EF4444"
        text-color="#EF4444"
        :rounded="false"
        :loading="isChatAutomationsBeingDeleted"
        :disabled="
          isNewAutomationCreationInProgress ||
          !isAnyChatAutomationSelectedForDeletion ||
          isChatAutomationsBeingDeleted
        "
        @click="onDeleteSelectedAutomations()"
        >Trash</va-button
      >

      <va-button
        color="#10B981"
        text-color="#10B981"
        :rounded="false"
        :loading="isNewAutomationCreationInProgress"
        :disabled="isNewAutomationCreationInProgress"
        @click="onCreateNewAutomation()"
        >Create Automation</va-button
      >
    </va-button-group>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, watch, watchEffect } from "vue";
import { Store, useStore } from "vuex";
import { Router, useRouter } from "vue-router";

import _ from "lodash";
import { VaButtonGroup, VaButton, VaCheckbox } from "vuestic-ui";

import { ChatAutomation, LoggerUtils } from "@shared-core";

import { StoreStateType } from "@/store";
import { ITelegramChatsAutomationDaoService } from "@/services/telegram/chats/i-telegram-chats-automation-dao.service";
import { ServiceProviderKeys } from "@/services/service-provider-keys";
import { RoutePaths } from "@/constants/route-paths";
import { EventsService } from "@/services/events/events.service";

interface Props {
  chatAutomationsToggleStateMap: Record<string, boolean>;
}

// eslint-disable-next-line no-undef
const props = defineProps<Props>();

// eslint-disable-next-line no-undef
const emit = defineEmits([
  "creating-new-automation",
  "deleting-chat-automations",
  "chat-automations-deleted",
  "toggle-all-chat-automations",
]);

const store: Store<StoreStateType> = useStore();
const router: Router = useRouter();

const telegramChatsAutomationDaoService: ITelegramChatsAutomationDaoService =
  inject(ServiceProviderKeys.TELEGRAM_CHATS_AUTOMATION_SERVICE);

const chatAutomationsComputed = computed<ChatAutomation[]>(
  () => store.state.telegramStore.chatAutomations
);

const chatAutomations = ref<ChatAutomation[]>([]);
const isNewAutomationCreationInProgress = ref<boolean>(false);
const isChatAutomationsBeingDeleted = ref<boolean>(false);
const isCheckboxChecked = ref<boolean>(false);
const checkboxWasChangedManually = ref<boolean>(false);
const isAnyChatAutomationSelectedForDeletion = ref<boolean>(false);

const newlyCreatedChatAutomationId = ref<string>("");

async function onCreateNewAutomation(): Promise<void> {
  try {
    emit("creating-new-automation");
    isNewAutomationCreationInProgress.value = true;

    const { uid } = await telegramChatsAutomationDaoService.create();
    newlyCreatedChatAutomationId.value = uid;

    EventsService.chatAutomationsUpdater$.next();
  } catch (error) {
    LoggerUtils.error(
      "ChatAutomationsActionButtons",
      "onCreateNewAutomation",
      error
    );

    isNewAutomationCreationInProgress.value = false;
  }
}

async function onDeleteSelectedAutomations(): Promise<void> {
  try {
    emit("deleting-chat-automations");
    isChatAutomationsBeingDeleted.value = true;

    const chatAutomationsDeletedAsPromises: Promise<void>[] = [];

    for (const key of Object.keys(props.chatAutomationsToggleStateMap)) {
      if (props.chatAutomationsToggleStateMap[key]) {
        chatAutomationsDeletedAsPromises.push(
          telegramChatsAutomationDaoService.delete(key)
        );
      }
    }

    await Promise.all(chatAutomationsDeletedAsPromises);

    EventsService.chatAutomationsUpdater$.next();
  } catch (error) {
    LoggerUtils.error(
      "ChatAutomationsActionButtons",
      "onDeleteSelectedAutomations",
      error
    );

    isChatAutomationsBeingDeleted.value = false;
    emit("chat-automations-deleted");
  }
}

function watchForChanges(): void {
  watchChatAutomationsToggleMapForChanges();
  watchChangesOnChatAutomationsFromStore();
  watchForTogglingOfAllChatAutomations();
}

function watchChangesOnChatAutomationsFromStore(): void {
  watchEffect(() => {
    if (!isNewAutomationCreationInProgress.value) {
      chatAutomations.value = chatAutomationsComputed.value;
    }

    if (isNewAutomationCreationInProgress.value) {
      navigateToChatAutomationWorkflowAfterCreatingNewAutomation();
    }

    if (isChatAutomationsBeingDeleted.value) {
      updateUIAfterDeletingAutomations();
    }
  });
}

async function navigateToChatAutomationWorkflowAfterCreatingNewAutomation(): Promise<void> {
  setTimeout(async () => {
    await router.push({
      name: RoutePaths.CHAT_AUTOMATION_WORKFLOW,
      params: {
        id: newlyCreatedChatAutomationId.value,
      },
    });
  }, 100);
}

function updateUIAfterDeletingAutomations(): void {
  isChatAutomationsBeingDeleted.value = false;
  chatAutomations.value = chatAutomationsComputed.value;
  emit("chat-automations-deleted");
}

function watchChatAutomationsToggleMapForChanges(): void {
  watch(
    props.chatAutomationsToggleStateMap,
    (newChatAutomationsToggleStateMap) => {
      let selectedDeletionCount = 0;

      for (const key of Object.keys(newChatAutomationsToggleStateMap)) {
        if (newChatAutomationsToggleStateMap[key]) {
          selectedDeletionCount++;
        }
      }

      isAnyChatAutomationSelectedForDeletion.value = selectedDeletionCount > 0;

      const isAllChatAutomationsSelectedForDeletion = _.isEqual(
        Object.keys(newChatAutomationsToggleStateMap).length,
        selectedDeletionCount
      );

      if (isCheckboxChecked.value) {
        if (!isAllChatAutomationsSelectedForDeletion) {
          checkboxWasChangedManually.value = true;
          isCheckboxChecked.value = false;
        }
      } else {
        if (isAllChatAutomationsSelectedForDeletion) {
          isCheckboxChecked.value = true;
        }
      }
    }
  );
}

function watchForTogglingOfAllChatAutomations(): void {
  watch(isCheckboxChecked, (newValue: boolean) => {
    if (checkboxWasChangedManually.value) {
      checkboxWasChangedManually.value = false;
      return;
    }

    emit("toggle-all-chat-automations", newValue);
  });
}

watchForChanges();
</script>

<style lang="scss" scoped></style>