<template>
  <div class="chat-automations-page">
    <h1 class="chat-automations-page__title">Chat Automations</h1>
    <ChatAutomationsView />
  </div>
</template>

<script lang="ts" setup>
import ChatAutomationsView from "@/components/chat-automations/chat-automations-view/ChatAutomationsView.vue";
</script>

<style lang="scss" scoped>
.chat-automations-page {
  @apply h-full w-full p-4;

  .chat-automations-page__title {
    @apply w-fit-content mx-auto mb-8 p-2 text-2xl font-bold rounded-md bg-white;
  }
}
</style>
