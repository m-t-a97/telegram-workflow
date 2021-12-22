<template>
  <div class="chat-automation-workflow-page-container">
    <ChatAutomationWorkflow :chatAutomation="chatAutomation" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { ChatAutomation } from "@shared-core";

import ChatAutomationWorkflow from "@/components/chat-automations/chat-automation-workflow/ChatAutomationWorkflow.vue";
import useFetchTelegramChatAutomation from "@/hooks/telegram/chats/useFetchTelegramChatAutomation";

interface Props {
  id: string;
}

const props = defineProps<Props>();

const { fetchChatAutomation } = useFetchTelegramChatAutomation();

const chatAutomation = ref<ChatAutomation>(null);

function initialise(): void {
  chatAutomation.value = {
    ...fetchChatAutomation(props.id),
  };
}

initialise();
</script>

<style lang="scss" scoped>
.chat-automation-workflow-page-container {
  @apply h-full w-full;
}
</style>
