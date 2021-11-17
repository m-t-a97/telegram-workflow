<template>
  <div class="chats-page-container">
    <template v-if="chats.length > 0">
      <h1 class="chats-page-title">All Chats</h1>
      <ChatsList :chats="chats" />
    </template>

    <h1 class="chats-page-title" v-if="chats.length <= 0">
      You currently have no chats...
    </h1>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, watchEffect } from "vue";
import { Store, useStore } from "vuex";

import { Api } from "telegram";

import { StoreStateType } from "@/store";
import ChatsList from "@/components/chats/ChatsList.vue";

const store: Store<StoreStateType> = useStore();

const chatsProxy = reactive<{ chats: Api.Chat[] }>({ chats: [] });
const chats = computed<Api.Chat[]>(() => chatsProxy.chats);

watchEffect(() => {
  chatsProxy.chats = store.state.telegramStore.chats as Api.Chat[];
});
</script>

<style lang="scss" scoped>
.chats-page-container {
  @apply h-full w-full p-4;

  .chats-page-title {
    @apply w-fit-content mx-auto mb-4 px-2 py-1 rounded-md text-2xl font-bold bg-white;
  }
}
</style>
