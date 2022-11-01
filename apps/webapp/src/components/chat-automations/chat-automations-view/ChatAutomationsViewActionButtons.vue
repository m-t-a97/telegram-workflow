<template>
  <div class="chat-automations-view-action-buttons-container">
    <va-button-group outline :rounded="false">
      <va-button v-if="chatAutomations.length > 0 || isChatAutomationsBeingDeleted" :rounded="false"
        :loading="isChatAutomationsBeingDeleted" :disabled="
          isNewAutomationCreationInProgress || isChatAutomationsBeingDeleted
        ">
        <va-checkbox v-model="isCheckboxChecked" color="#000000" />
      </va-button>

      <va-button v-if="chatAutomations.length > 0 || isChatAutomationsBeingDeleted" color="#EF4444" text-color="#EF4444"
        :rounded="false" :loading="isChatAutomationsBeingDeleted" :disabled="
          isNewAutomationCreationInProgress ||
          !isAnyChatAutomationSelectedForDeletion ||
          isChatAutomationsBeingDeleted
        " @click="onDeleteSelectedAutomations()">Trash</va-button>

      <va-button color="#10B981" text-color="#10B981" :rounded="false" :loading="isNewAutomationCreationInProgress"
        :disabled="isNewAutomationCreationInProgress" @click="onCreateNewAutomation()">Create Automation</va-button>
    </va-button-group>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, watch, watchEffect } from "vue";
import { Store, useStore } from "vuex";
import { Router, useRouter } from "vue-router";

import _ from "lodash";
import { VaButtonGroup, VaButton, VaCheckbox } from "vuestic-ui";

import { ChatAutomation, LoggerUtils } from "@/shared-core";

import { StoreStateType } from "@/store";
import { ITelegramChatAutomationsDaoService } from "@/services/telegram/chats/i-telegram-chat-automations-dao.service";
import { ServiceProviderKeys } from "@/services/service-provider-keys";
import { RoutePaths } from "@/constants/route-paths";

interface Props {
  chatAutomationsToggleStateMap: Record<string, boolean>;
}

const props = defineProps<Props>();

const emit = defineEmits([
  "creating-new-automation",
  "deleting-chat-automations",
  "chat-automations-deleted",
  "toggle-all-chat-automations",
]);

const store: Store<StoreStateType> = useStore();
const router: Router = useRouter();

const telegramChatsAutomationDaoService: ITelegramChatAutomationsDaoService =
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
    const { id } = await telegramChatsAutomationDaoService.create();
    newlyCreatedChatAutomationId.value = id;
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
    await telegramChatsAutomationDaoService.getAll();
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
    if (isNewAutomationCreationInProgress.value) {
      if (!_.isEmpty(newlyCreatedChatAutomationId.value)) {
        router.push({
          name: RoutePaths.CHAT_AUTOMATION_WORKFLOW,
          params: {
            id: newlyCreatedChatAutomationId.value,
          },
        });
      }
    } else {
      chatAutomations.value = chatAutomationsComputed.value;
    }

    if (isChatAutomationsBeingDeleted.value) {
      updateUIAfterDeletingAutomations();
    }
  });
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

<style lang="scss" scoped>

</style>
