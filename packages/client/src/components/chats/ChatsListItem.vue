<template>
  <div class="chat-list-item">
    <!-- <div class="chat-list-item-image-container"></div> -->

    <div>
      <span class="text-black font-semibold"
        >{{
          isChatChannel ? `-100${props.chat.id}` : `-${props.chat.id}`
        }}&nbsp;
      </span>
      <span class="text-black">{{ (props.chat as Api.Chat).title }}</span>
    </div>
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
