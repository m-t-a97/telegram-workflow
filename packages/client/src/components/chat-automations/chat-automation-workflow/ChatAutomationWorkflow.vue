<template>
  <div class="chat-automation-workflow-container">
    <ChatAutomationWorkflowToolbar
      :chatAutomation="currentChatAutomation"
      :isAutomationValid="isAutomationValid"
    />

    <ChatAutomationWorkflowChatsSelection
      :chatAutomation="currentChatAutomation"
      @is-automation-valid="onIsAutomationValid($event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { ChatAutomation } from "@shared-core";

import ChatAutomationWorkflowToolbar from "./ChatAutomationWorkflowToolbar.vue";
import ChatAutomationWorkflowChatsSelection from "./ChatAutomationWorkflowChatsSelection.vue";

interface Props {
  chatAutomation: ChatAutomation;
}

const props = defineProps<Props>();

const currentChatAutomation = computed(() => props.chatAutomation);

const isAutomationValid = ref<boolean>(false);

function onIsAutomationValid(value: boolean): void {
  isAutomationValid.value = value;
}
</script>

<style lang="scss" scoped>
.chat-automation-workflow-container {
  @apply h-full w-full;
}
</style>
