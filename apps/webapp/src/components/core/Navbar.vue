<script setup lang="ts">
import { VaIcon } from "vuestic-ui";

const emit = defineEmits(["show-sidebar"]);

const appName = import.meta.env.VITE_PROJECT_NAME;
</script>

<template>
  <div class="w-full px-4 py-4 fixed z-20 flex flex-row justify-between items-center bg-white">
    <div class="flex flex-row justify-center items-center">
      <button type="button" class="mr-2" @click="emit('show-sidebar')">
        <va-icon name="menu" class="text-black" />
      </button>

      <h1 class="text-base font-bold">{{ appName }}</h1>
    </div>
  </div>
</template>


