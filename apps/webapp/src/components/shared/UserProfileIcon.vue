<template>
  <div class="icon-container">
    <img :src="userIconAsSvg" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { Store, useStore } from "vuex";

import { toSvg } from "jdenticon";

import { DataUriUtils } from "@/shared-core";

import { StoreStateType } from "@/store";

const store: Store<StoreStateType> = useStore();

const userIconAsSvg = ref<string>("");

watchEffect(() => {
  userIconAsSvg.value = DataUriUtils.convertToSVG(
    toSvg(store.state.userStore.user?.email, 50)
  );
});
</script>

<style lang="scss" scoped>
.icon-container {
  @apply h-10 w-10 md: h-12 md:w-12 rounded-md bg-white;

  img {
    height: 100%;
    width: 100%;
  }
}
</style>
