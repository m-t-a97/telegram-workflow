<script lang="ts" setup>
import { computed, inject, ref, watch, watchEffect } from "vue";
import { Store, useStore } from "vuex";

import { VaIcon, VaSelect } from "vuestic-ui";
import { Api } from "telegram";
import { isNil, isEmpty, isEqual, has } from "lodash";

import { ChatAutomation, LoggerUtils } from "@/shared-core";

import { StoreStateType } from "@/store/index";
import { ServiceProviderKeys } from "@/services/service-provider-keys";
import { ITelegramChatAutomationsDaoService } from "@/services/telegram/chats/i-telegram-chat-automations-dao.service";

const props = defineProps<{
  chatAutomation: ChatAutomation;
}>();

const emit = defineEmits(["is-automation-valid"]);

type ChatSelectionType = {
  value: number;
  chatId: string;
  chatName: string;
  isCreator: boolean;
  isChannel: boolean;
};

const store: Store<StoreStateType> = useStore();

const telegramChatsAutomationDaoService: ITelegramChatAutomationsDaoService =
  inject(ServiceProviderKeys.TELEGRAM_CHATS_AUTOMATION_SERVICE);

const chatsOptions = ref<ChatSelectionType[]>([]);
const sourceChat = ref<ChatSelectionType>(null);
const availableChatDestinations = ref<ChatSelectionType[]>([]);
const selectedChatDestinations = ref<ChatSelectionType[]>([]);

const isAutomationValid = computed(
  () =>
    !isNil(sourceChat.value.chatId) &&
    !isEmpty(selectedChatDestinations.value)
);

function initialise(): void {
  buildChatAutomationForUI();
}

function buildChatAutomationForUI(): void {
  mapAllChatsToChatSelections();
  initialiseSourceChat();
  updateAvailableChatDestinations();
  initialiseSelectedChatDestinations();
}

function mapAllChatsToChatSelections(): void {
  const chats = [...store.state.telegramStore.chats];
  console.log(chats);

  chatsOptions.value = chats.map((chat: Api.TypeChat, index: number) => {
    type GroupOrChannel = Api.Chat | Api.Channel;

    const isChannel = has(chat, "broadcast");
    const chatId = isChannel ? `-100${chat.id}` : `-${chat.id}`;

    return {
      value: index,
      chatId,
      chatName: (chat as GroupOrChannel).title,
      isCreator: (chat as GroupOrChannel).creator,
      isChannel,
    };
  });
}

function initialiseSourceChat(): void {
  const sourceChatId = props.chatAutomation.sourceChatId;

  if (!isNil(sourceChatId)) {
    sourceChat.value = chatsOptions.value.find(
      (chatSelection: ChatSelectionType) =>
        isEqual(chatSelection.chatId, sourceChatId)
    );
  } else {
    sourceChat.value = {} as any;
  }
}

function updateAvailableChatDestinations(): void {
  availableChatDestinations.value = chatsOptions.value.filter(
    (chatDestinationSelection: ChatSelectionType) => {
      const isNotSourceChat = !isEqual(
        chatDestinationSelection.chatId,
        sourceChat.value.chatId
      );

      const isCreatorOfChannel =
        chatDestinationSelection.isChannel &&
        chatDestinationSelection.isCreator;

      return (
        isNotSourceChat &&
        (!chatDestinationSelection.isChannel || isCreatorOfChannel)
      );
    }
  );

  selectedChatDestinations.value = [];
}

function initialiseSelectedChatDestinations(): void {
  if (!isEmpty(props.chatAutomation.destinationChatIds)) {
    const destinationChatIds = props.chatAutomation.destinationChatIds;

    for (let i = 0; i < destinationChatIds.length; i++) {
      const foundDestinationChat: ChatSelectionType =
        availableChatDestinations.value.find(
          (chatSelection: ChatSelectionType) =>
            isEqual(chatSelection.chatId, destinationChatIds[i])
        );

      if (!isNil(foundDestinationChat)) {
        selectedChatDestinations.value.push(foundDestinationChat);
      }
    }
  } else {
    updateAvailableChatDestinations();
  }
}

async function saveUpdatedSourceChat(chatId: string): Promise<void> {
  try {
    await telegramChatsAutomationDaoService.update(props.chatAutomation.id, {
      sourceChatId: chatId.toString() as any,
    });

    await setIsTouched();
  } catch (error) {
    LoggerUtils.error(
      "ChatAutomationWorkflowChatSelection",
      "saveUpdatedSourceChat",
      error
    );
  }
}

async function saveUpdatedDestinationChats(): Promise<void> {
  try {
    await telegramChatsAutomationDaoService.update(props.chatAutomation.id, {
      destinationChatIds: selectedChatDestinations.value.map(
        (chatSelection: ChatSelectionType) => chatSelection.chatId
      ),
    });

    await setIsTouched();
  } catch (error) {
    LoggerUtils.error(
      "ChatAutomationWorkflowChatSelection",
      "saveUpdatedDestinationChats",
      error
    );
  }
}

async function setIsTouched(): Promise<void> {
  if (!props.chatAutomation.touched) {
    await telegramChatsAutomationDaoService.update(props.chatAutomation.id, {
      touched: true,
    });
  }
}

initialise();

watchEffect(() => {
  emit("is-automation-valid", isAutomationValid.value);
});

watch(sourceChat, async (newValue: ChatSelectionType) => {
  await saveUpdatedSourceChat(newValue.chatId);
  updateAvailableChatDestinations();
});

watch(selectedChatDestinations, (newValue: ChatSelectionType[]) => {
  if (isEmpty(newValue)) {
    emit("is-automation-valid", false);
  }

  saveUpdatedDestinationChats();
});
</script>

<template>
  <div class="mt-8 flex flex-col justify-start items-center">
    <div class="p-4 flex flex-col justify-center items-center rounded-md bg-white">
      <p class="mb-2 text-base font-bold text-black">Source</p>
      <va-select v-model="sourceChat" :options="chatsOptions"
        :text-by="(chatSelection: ChatSelectionType) => chatSelection.chatName" />
    </div>

    <va-icon name="arrow_circle_down" class="my-8 text-white" size="2.5rem" />

    <div class="p-4 flex flex-col justify-center items-center rounded-md bg-white">
      <p class="mb-2 text-base font-bold text-black">Destination</p>

      <va-select v-model="selectedChatDestinations" multiple :max-selections="5" :options="availableChatDestinations"
        :text-by="(chatSelection: ChatSelectionType) => chatSelection.chatName" />
    </div>
  </div>
</template>

<style lang="scss">
.va-input-wrapper {
  @apply border border-solid border-gray-300 rounded-sm;
}
</style>
