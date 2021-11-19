<template>
  <div class="chat-automation-workflow-toolbar">
    <div class="chat-automation-workflow-toolbar-section-start">
      <button type="button" class="mr-4" @click="router.back()">
        <va-icon name="west" size="2.5rem" />
      </button>

      <va-input
        v-model="chatAutomationName"
        outline
        :error="chatAutomationName === ''"
        error-messages="Name cannot be empty"
        @update:model-value="chatAutomationName$.next($event)"
      />
    </div>

    <div class="chat-automation-workflow-toolbar-section-end">
      <va-switch
        class="mr-2"
        color="success"
        size="small"
        v-model="chatAutomationActive"
        :disabled="!isAutomationValid"
        :loading="isActivatingAutomation"
        @update:model-value="chatAutomationActive$.next($event)"
      />

      <span
        class="w-20 text-sm text-center font-bold"
        :class="{
          'text-green-500': chatAutomationActive,
          'text-red-500': !chatAutomationActive,
        }"
        >{{ chatAutomationActive ? "ACTIVE" : "INACTIVE" }}</span
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Router } from "vue-router";
import { Store, useStore } from "vuex";

import _ from "lodash";
import { VaSwitch, VaIcon, VaInput } from "vuestic-ui";
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  Subscription,
  tap,
} from "rxjs";
import axios from "axios";

import { ChatAutomation, LoggerUtils, RxjsHelperUtils } from "@shared-core";

import { StoreStateType } from "@/store";
import { ITelegramChatsAutomationDaoService } from "@/services/telegram/chats/i-telegram-chats-automation-dao.service";
import { ServiceProviderKeys } from "@/services/service-provider-keys";
import { APIEndpoints } from "@/constants/api-endpoints";
import { LocalStorageService } from "@/services/storage/local-storage.service";
import { LocalStorageKeys } from "@/constants/local-storage-keys";
import { EventsService } from "@/services/events/events.service";

interface Props {
  chatAutomation: ChatAutomation;
  isAutomationValid: boolean;
}

// eslint-disable-next-line no-undef
const props = defineProps<Props>();

const store: Store<StoreStateType> = useStore();
const router: Router = useRouter();

const telegramChatsAutomationDaoService: ITelegramChatsAutomationDaoService =
  inject(ServiceProviderKeys.TELEGRAM_CHATS_AUTOMATION_SERVICE);

const isAutomationValidComputed = computed(() => props.isAutomationValid);

const chatAutomationName = ref<string>("");
const chatAutomationActive = ref<boolean>(false);
const chatAutomationName$ = new BehaviorSubject<string>(null);
const chatAutomationActive$ = new BehaviorSubject<boolean>(null);
let chatAutomationName_$: Subscription;
let chatAutomationActive_$: Subscription;

const isActivatingAutomation = ref<boolean>(false);

function registerDebounceEffectOnChatAutomationNameInputEvent(): void {
  chatAutomationName_$ = chatAutomationName$
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(async (updatedName: string) => {
        if (_.isNil(updatedName)) {
          return;
        }

        await telegramChatsAutomationDaoService.update(
          props.chatAutomation.uid,
          {
            name: updatedName,
          }
        );

        EventsService.chatAutomationsUpdater$.next();
      }),
      catchError((error) => {
        LoggerUtils.error(
          "ChatAutomationWorkflowToolbar",
          "registerDebounceEffectOnChatAutomationNameInputEvent",
          error
        );

        return null;
      })
    )
    .subscribe();
}

function registerDebounceEffectOnChatAutomationActiveToggle(): void {
  chatAutomationActive_$ = chatAutomationActive$
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(async (updatedActive: boolean) => {
        try {
          if (_.isNil(updatedActive)) {
            return;
          }

          isActivatingAutomation.value = true;

          const savedTelegramSession = await LocalStorageService.getItem(
            LocalStorageKeys.SAVED_TELEGRAM_SESSION
          );

          if (updatedActive) {
            await axios.post(
              `${process.env.VUE_APP_API_URL}/${APIEndpoints.CHAT_AUTOMATION_ACTIVATE}`,
              {
                telegramSessionKey: savedTelegramSession,
                chatAutomation: props.chatAutomation,
              }
            );
          } else {
            await axios.post(
              `${process.env.VUE_APP_API_URL}/${APIEndpoints.CHAT_AUTOMATION_DEACTIVATE}`,
              { chatAutomation: props.chatAutomation }
            );
          }

          isActivatingAutomation.value = false;

          await telegramChatsAutomationDaoService.update(
            props.chatAutomation.uid,
            {
              active: updatedActive,
            }
          );

          EventsService.chatAutomationsUpdater$.next();
        } catch (error) {
          LoggerUtils.error(
            "ChatAutomationWorkflowToolbar",
            "registerDebounceEffectOnChatAutomationActiveToggle",
            error
          );

          isActivatingAutomation.value = false;
        }
      }),
      catchError((error) => {
        LoggerUtils.error(
          "ChatAutomationWorkflowToolbar",
          "registerDebounceEffectOnChatAutomationActiveToggle",
          error
        );

        isActivatingAutomation.value = false;

        return null;
      })
    )
    .subscribe();
}

function initialise(): void {
  chatAutomationName.value = props.chatAutomation.name;
  chatAutomationActive.value = props.chatAutomation.active;
}

function setAutomationInactiveIfInvalid(): void {
  if (!isAutomationValidComputed.value) {
    chatAutomationActive.value = false;
    chatAutomationActive$.next(false);
  }
}

onMounted(() => {
  try {
    registerDebounceEffectOnChatAutomationNameInputEvent();
    registerDebounceEffectOnChatAutomationActiveToggle();
  } catch (error) {
    LoggerUtils.error("ChatAutomationWorkflowToolbar", "onMounted", error);
  }
});

onUnmounted(() => {
  RxjsHelperUtils.unsubscribe(chatAutomationName_$);
  RxjsHelperUtils.unsubscribe(chatAutomationActive_$);
});

initialise();

watch(isAutomationValidComputed, () => {
  setAutomationInactiveIfInvalid();
});
</script>

<style lang="scss" scoped>
.chat-automation-workflow-toolbar {
  @apply px-4 py-2 flex flex-row justify-between items-center bg-white;

  .chat-automation-workflow-toolbar-section-start {
    @apply flex flex-row justify-center items-center;

    .chat-automation-workflow-name {
      @apply px-4 py-2 text-sm font-bold border border-solid border-gray-400 rounded-md;
    }
  }

  .chat-automation-workflow-toolbar-section-end {
    @apply flex flex-row justify-center items-center;
  }
}
</style>
