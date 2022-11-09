<script setup lang="ts">
import { computed } from "vue";

import { Api } from "telegram";
import { has } from "lodash";

const props = defineProps<{
  chat: Api.Chat;
}>();

const isChatChannel = computed<boolean>(() => has(props.chat, "broadcast"));
</script>

<template>
  <div
    class="p-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center rounded-md border border-solid border-black bg-white">
    <span class="mb-4 sm:mb-0 text-black font-semibold inline-block">{{ (props.chat as Api.Chat).title }}</span>
    <span class="text-black font-semibold inline-block">{{ isChatChannel ? `-100${props.chat.id}` : `-${props.chat.id}`
    }}&nbsp;
    </span>
  </div>
</template>
