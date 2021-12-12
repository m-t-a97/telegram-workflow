<template>
  <div>
    <va-card>
      <va-card-title class="text-base font-bold text-black"
        >Telegram Account</va-card-title
      >
      <va-card-content class="flex flex-row justify-between items-center">
        <span
          class="text-base font-bold"
          :class="{
            'text-green-500': isConnectedToTelegram,
            'text-red-500': !isConnectedToTelegram,
          }"
          >{{ isConnectedToTelegram ? "Connected" : "Not Connected" }}</span
        >

        <va-button
          v-if="!isConnectedToTelegram"
          outline
          color="#10B981"
          :rounded="false"
          :loading="reconnectingToTelegram"
          :disabled="reconnectingToTelegram"
          @click="onOpenTelegramAccountSetupModal()"
          >CONNECT</va-button
        >
      </va-card-content>
    </va-card>

    <SettingsTelegramAccountSetupCardConnectModal
      :showTelegramAccountSetupModal="showTelegramAccountSetupModal"
      @toggle-telegram-account-setup-modal="
        showTelegramAccountSetupModal = !showTelegramAccountSetupModal
      "
    />
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, watchEffect } from "vue";
import { Store, useStore } from "vuex";

import { VaCard, VaCardTitle, VaCardContent, VaButton } from "vuestic-ui";

import { StoreStateType } from "@/store";
import { ITelegramAuthService } from "@/services/telegram/auth/i-telegram-auth.service";
import { ServiceProviderKeys } from "@/services/service-provider-keys";
import SettingsTelegramAccountSetupCardConnectModal from "@/components/settings/telegram-account/SettingsTelegramAccountSetupCardConnectModal.vue";

const store: Store<StoreStateType> = useStore();

const telegramAuthService: ITelegramAuthService = inject(
  ServiceProviderKeys.TELEGRAM_AUTH_SERVICE
);

const isConnectedToTelegram = ref<boolean>(false);
const showTelegramAccountSetupModal = ref<boolean>(false);
const reconnectingToTelegram = ref<boolean>(false);

async function onOpenTelegramAccountSetupModal(): Promise<void> {
  if (!isConnectedToTelegram.value) {
    const isTelegramClientConnected = await telegramAuthService.isConnected();

    if (!isTelegramClientConnected) {
      reconnectingToTelegram.value = true;
      await telegramAuthService.initialise();
    }

    reconnectingToTelegram.value = false;
    showTelegramAccountSetupModal.value = true;
  }
}

watchEffect(() => {
  isConnectedToTelegram.value = store.state.telegramStore.isLoggedIn;
});
</script>

<style lang="scss" scoped>
.va-button {
  flex: 0.35;
}
</style>
