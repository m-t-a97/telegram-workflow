<template>
  <va-list class="chat-automations-list">
    <va-list-item
      v-for="chatAutomation in props.chatAutomations"
      :key="chatAutomation.uid"
    >
      <va-inner-loading
        class="w-full"
        icon="loop"
        :size="20"
        :loading="
          props.isChatAutomationsBeingDeleted &&
          chatAutomationsToggleStateMap[chatAutomation.uid]
        "
      >
        <div class="w-full flex flex-row justify-between items-center">
          <va-list-item-section avatar>
            <va-checkbox
              v-show="!props.isChatAutomationsBeingDeleted"
              color="#000000"
              v-model="chatAutomationListItemCheckboxMap[chatAutomation.uid]"
              @click="onCheckedListItem(chatAutomation.uid)"
            />
          </va-list-item-section>

          <router-link
            class="w-full"
            :to="`/dashboard/workflow/chat-automation-workflow/${chatAutomation.uid}`"
          >
            <va-list-item-section>
              <va-list-item-label class="font-bold">
                {{ chatAutomation.name }}
              </va-list-item-label>
            </va-list-item-section>
          </router-link>

          <va-list-item-section icon>
            <div
              class="p-2 rounded-full"
              :class="{
                'bg-green-500': chatAutomation.active,
                'bg-red-500': !chatAutomation.active,
              }"
            ></div>
          </va-list-item-section>
        </div>
      </va-inner-loading>
    </va-list-item>
  </va-list>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

import {
  VaCheckbox,
  VaList,
  VaListItem,
  VaListItemLabel,
  VaListItemSection,
  VaInnerLoading,
} from "vuestic-ui";

import { ChatAutomation } from "@shared-core";

interface Props {
  chatAutomations: ChatAutomation[];
  chatAutomationsToggleStateMap: Record<string, boolean>;
  isChatAutomationsBeingDeleted: boolean;
}

// eslint-disable-next-line no-undef
const props = defineProps<Props>();

// eslint-disable-next-line no-undef
const emit = defineEmits(["list-item-toggled"]);

const chatAutomationListItemCheckboxMap = ref<Record<string, boolean>>({});

function onCheckedListItem(uid: string) {
  emit("list-item-toggled", {
    uid,
    value: chatAutomationListItemCheckboxMap.value[uid],
  });
}

function watchForChanges(): void {
  watchAutomationsToggleStateMapForChanges();
}

function watchAutomationsToggleStateMapForChanges(): void {
  watch(props.chatAutomationsToggleStateMap, (newValue) => {
    chatAutomationListItemCheckboxMap.value = newValue;
  });
}

watchForChanges();
</script>

<style lang="scss"></style>
