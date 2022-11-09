<script lang="ts" setup>
import { computed, ref } from "vue";

import { ChatAutomation } from "@/shared-core";

import ChatAutomationWorkflowToolbar from "./ChatAutomationWorkflowToolbar.vue";
import ChatAutomationWorkflowChatsSelection from "./ChatAutomationWorkflowChatsSelection.vue";

const props = defineProps<{
  chatAutomation: ChatAutomation;
}>();

const chatAutomation = computed(() => props.chatAutomation);

const isAutomationValid = ref<boolean>(false);

function onIsAutomationValid(value: boolean): void {
  isAutomationValid.value = value;
}
</script>

<template>
  <div class="h-full w-full">
    <ChatAutomationWorkflowToolbar :chatAutomation="chatAutomation" :isAutomationValid="isAutomationValid" />

    <ChatAutomationWorkflowChatsSelection :chatAutomation="chatAutomation"
      @is-automation-valid="onIsAutomationValid($event)" />
  </div>
</template>
