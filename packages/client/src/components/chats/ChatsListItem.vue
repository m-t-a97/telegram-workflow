<template>
  <div class="chat-list-item">
    <div class="chat-list-item-image-container"></div>

    <div>
      <span class="text-black">{{ props.chat.id }}: </span>
      <span class="text-black">{{ (props.chat as Api.Chat).title }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Api } from "telegram";

interface Props {
  chat: Api.Chat;
}

// eslint-disable-next-line no-undef
const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
.chat-list-item {
  @apply p-4 flex flex-row justify-start items-center rounded-md border border-solid border-black bg-white;

  .chat-list-item-image-container {
    @apply mr-4 p-4 bg-black;
    border-radius: 100%;

    img {
      object-fit: cover;
    }
  }
}
</style>
