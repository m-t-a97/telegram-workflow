<template>
  <div class="navbar-container">
    <div class="flex flex-row justify-center items-center">
      <button type="button" class="mr-2" @click="emit('show-sidebar')">
        <va-icon name="menu" class="text-black" />
      </button>

      <h1 class="text-base font-bold">{{ appName }}</h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { VaIcon } from "vuestic-ui";

const emit = defineEmits(["show-sidebar"]);

const appName = process.env.VUE_APP_PROJECT_NAME;
</script>

<style lang="scss" scoped>
.navbar-container {
  @apply w-full px-4 py-4 fixed z-20 flex flex-row justify-between items-center bg-white;
}
</style>
