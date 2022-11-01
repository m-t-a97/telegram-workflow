<template>
  <div class="settings-page-container">
    <h1 class="mb-4 text-2xl font-bold text-white text-center">SETTINGS</h1>

    <div class="mt-4">
      <SettingsTelegramAccountSetupCard />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SettingsTelegramAccountSetupCard from "@/components/settings/telegram-account/SettingsTelegramAccountSetupCard.vue";
</script>

<style lang="scss" scoped>
.settings-page-container {
  @apply h-full w-full p-4;
}
</style>
