<script setup lang="ts">
import { Api } from "telegram";

import ChatsListItem from "@/components/chats/ChatsListItem.vue";

interface Props {
  chats: Api.Chat[];
}

const props = defineProps<Props>();
</script>

<template>
  <div class="h-full w-full">
    <div :class="{ 'mb-4': index !== props.chats.length - 1 }" v-for="(chat, index) in props.chats"
      :key="chat.id.toString()">
      <ChatsListItem :chat="chat" />
    </div>
  </div>
</template>
