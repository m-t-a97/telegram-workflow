<template>
  <div class="chats-list-container">
    <div
      :class="{ 'mb-4': index !== props.chats.length - 1 }"
      v-for="(chat, index) in props.chats"
      :key="chat.id"
    >
      <ChatsListItem :chat="chat" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Api } from "telegram";

import ChatsListItem from "@/components/chats/ChatsListItem.vue";

interface Props {
  chats: Api.Chat[];
}

// eslint-disable-next-line no-undef
const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
.chats-list-container {
  @apply h-full w-full;
}
</style>
