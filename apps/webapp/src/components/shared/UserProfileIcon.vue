<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { Store, useStore } from "vuex";

import { toSvg } from "jdenticon";

import { DataUriUtils } from "@/shared-core";

import { StoreStateType } from "@/store/index";

const store: Store<StoreStateType> = useStore();

const userIconAsSvg = ref<string>("");

watchEffect(() => {
  userIconAsSvg.value = DataUriUtils.convertToSVG(
    toSvg(store.state.userStore.user?.email, 50)
  );
});
</script>

<template>
  <div class="h-10 w-10 md:h-12 md:w-12 rounded-md bg-white">
    <img :src="userIconAsSvg" class="h-full w-full" />
  </div>
</template>
