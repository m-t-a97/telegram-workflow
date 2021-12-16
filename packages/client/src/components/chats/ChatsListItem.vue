<template>
  <div class="chat-list-item">
    <!-- <div class="chat-list-item__image-container"></div> -->

    <span
      class="chat-list-item__title text-black font-semibold inline-block"
      >{{ (props.chat as Api.Chat).title }}</span
    >

    <span class="text-black font-semibold inline-block"
      >{{ isChatChannel ? `-100${props.chat.id}` : `-${props.chat.id}` }}&nbsp;
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { Api } from "telegram";
import _ from "lodash";

interface Props {
  chat: Api.Chat;
}

const props = defineProps<Props>();

const isChatChannel = computed<boolean>(() => _.has(props.chat, "broadcast"));
</script>

<style lang="scss" scoped>
.chat-list-item {
  @apply p-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center rounded-md border border-solid border-black bg-white;

  .chat-list-item__title {
    @apply mb-4 sm:mb-0;
  }

  .chat-list-item__image-container {
    @apply mr-4 p-4 bg-black;
    border-radius: 100%;

    img {
      object-fit: cover;
    }
  }
}
</style>
