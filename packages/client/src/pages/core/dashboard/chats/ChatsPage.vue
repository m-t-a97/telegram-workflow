<template>
  <div class="chats-page-container">
    <template v-if="!_.isEmpty(chats)">
      <h1 class="chats-page-title">All Chats</h1>
      <ChatsList :chats="chats" />
    </template>

    <h1 v-if="_.isEmpty(chats)" class="chats-page-title">
      You currently have no chats...
    </h1>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Store, useStore } from "vuex";

import { Api } from "telegram";
import _ from "lodash";

import { StoreStateType } from "@/store";
import ChatsList from "@/components/chats/ChatsList.vue";

const store: Store<StoreStateType> = useStore();

const chats = computed<Api.Chat[]>(
  () => store.state.telegramStore.chats as Api.Chat[]
);
</script>

<style lang="scss" scoped>
.chats-page-container {
  @apply h-full w-full p-4;

  .chats-page-title {
    @apply w-fit-content mx-auto mb-4 px-2 py-1 rounded-md text-2xl font-bold bg-white;
  }
}
</style>
