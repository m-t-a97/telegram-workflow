<script setup lang="ts">
import { inject, onUnmounted, ref, watchEffect } from "vue";
import { Store, useStore } from "vuex";

import { VaModal } from "vuestic-ui";
import { fromEvent, Subscription, tap } from "rxjs";

import { RxjsHelperUtils } from "@/shared-core";

import { StoreStateType } from "@/store/index";
import { TelegramStoreActions } from "@/store/modules/telegram.store";
import { ITelegramAuthService } from "@/services/telegram/auth/i-telegram-auth.service";
import { ServiceProviderKeys } from "@/services/service-provider-keys";

const props = defineProps<{
  showTelegramAccountDisconnectModal: boolean;
}>();

const emit = defineEmits(["toggle-telegram-account-disconnect-modal"]);

const store: Store<StoreStateType> = useStore();

const telegramAuthService: ITelegramAuthService = inject(
  ServiceProviderKeys.TELEGRAM_AUTH_SERVICE
);

const modalTitle = "NOTICE";
const modalMessage =
  "Are you sure you want to disconnect your telegram account?";

const showModalInFullScreen = ref<boolean>(false);
const showTelegramAccountDisconnectModalRef = ref<boolean>(false);

let screenWidth_$: Subscription;

function watchScreenWidth(): void {
  screenWidth_$ = fromEvent(window, "resize")
    .pipe(
      tap((event: any) => {
        if (event.target.screen.width <= 640) {
          showModalInFullScreen.value = true;
        } else {
          showModalInFullScreen.value = false;
        }
      })
    )
    .subscribe();
}

async function onDisconnectTelegramAccount(): Promise<void> {
  await store.dispatch(
    TelegramStoreActions.UPDATE_IS_LOGGED_INTO_TELEGRAM,
    false
  );
  onEmitCloseModal();
}

function onEmitCloseModal(): void {
  emit("toggle-telegram-account-disconnect-modal");
}

onUnmounted(() => {
  RxjsHelperUtils.unsubscribe(screenWidth_$);
});

watchScreenWidth();

watchEffect(() => {
  showTelegramAccountDisconnectModalRef.value =
    props.showTelegramAccountDisconnectModal;
});
</script>

<template>
  <div>
    <va-modal v-model="showTelegramAccountDisconnectModalRef" size="medium" ok-text="YES" cancel-text="NO"
      :title="modalTitle" :message="modalMessage" :fullscreen="showModalInFullScreen"
      @ok="onDisconnectTelegramAccount()" @cancel="onEmitCloseModal()" @click-outside="onEmitCloseModal()" />
  </div>
</template>
