import { StoreStateType } from '@/store';
<template>
  <va-modal
    v-model="showTelegramAccountSetupModalRef"
    size="small"
    overlay-opacity="0.2"
    hide-default-actions
    :fullscreen="showModalInFullScreen"
    @click-outside="onEmitCloseModal()"
  >
    <template #header>
      <h2 class="text-lg font-bold text-center">
        Connect your telegram account
      </h2>
    </template>

    <slot>
      <div class="telegram-login-container">
        <va-form class="flex flex-col justify-center items-center">
          <template v-if="isMobileNumberStep">
            <label class="text-center text-base font-bold text-black"
              >Enter your phone number in international format:</label
            >

            <input
              type="text"
              class="text-input-box"
              placeholder="+441234567890"
              v-model="phoneNumber"
            />

            <p class="error-message" v-if="errorMessage !== ''">
              {{ errorMessage }}
            </p>

            <button
              type="button"
              class="p-2 rounded-md bg-green-300"
              :class="{
                'text-black': phoneNumber !== '',
                'cursor-not-allowed': phoneNumber === '',
              }"
              :disabled="phoneNumber === ''"
              @click="onSendCode()"
            >
              Send Code
            </button>
          </template>

          <template v-if="isAuthCodeStep">
            <label class="text-base font-bold text-black"
              >Enter the authentication code:</label
            >

            <input type="text" class="text-input-box" v-model="authCode" />

            <p class="error-message" v-if="errorMessage !== ''">
              {{ errorMessage }}
            </p>

            <button
              type="button"
              class="p-2 rounded-md bg-green-300"
              :class="{
                'text-black': authCode !== '',
                'cursor-not-allowed': authCode === '',
              }"
              :disabled="authCode === ''"
              @click="onVerifyCode()"
            >
              Verify Code
            </button>
          </template>

          <template v-if="isTwoFactorPasswordStep">
            <label class="text-base font-bold text-black"
              >Enter your 2FA password:</label
            >

            <div class="two-factor-password-input-container">
              <input
                :type="showTwoFactorPassword ? 'text' : 'password'"
                class="p-2 text-black border-none"
                v-model="twoFactorPassword"
              />

              <div class="two-factor-toggle-button-container">
                <button type="button" @click="onToggleTwoFactorPassword()">
                  <va-icon name="visibility" v-if="showTwoFactorPassword" />
                  <va-icon
                    name="visibility_off"
                    v-if="!showTwoFactorPassword"
                  />
                </button>
              </div>
            </div>

            <p class="error-message" v-if="errorMessage !== ''">
              {{ errorMessage }}
            </p>

            <button
              type="button"
              class="p-2 rounded-md bg-green-300"
              :class="{
                'text-black': twoFactorPassword !== '',
                'cursor-not-allowed': twoFactorPassword === '',
              }"
              :disabled="twoFactorPassword === ''"
              @click="onTwoFactorPasswordEntered()"
            >
              Verify Password
            </button>
          </template>
        </va-form>
      </div>
    </slot>

    <template #footer>
      <va-button @click="onEmitCloseModal()">Cancel</va-button>
    </template>
  </va-modal>
</template>

<script lang="ts" setup>
import { inject, onUnmounted, ref, watchEffect } from "vue";
import { Store, useStore } from "vuex";

import _ from "lodash";
import { VaForm, VaIcon, VaModal, VaButton } from "vuestic-ui";
import { fromEvent, Subscription, tap } from "rxjs";

import { LoggerUtils, RxjsHelperUtils } from "@shared-core";

import { StoreStateType } from "@/store";
import { TelegramStoreActions } from "@/store/modules/telegram.store";
import { ITelegramAuthService } from "@/services/telegram/auth/i-telegram-auth.service";
import { ServiceProviderKeys } from "@/services/service-provider-keys";

interface Props {
  showTelegramAccountSetupModal: boolean;
}

// eslint-disable-next-line no-undef
const props = defineProps<Props>();

// eslint-disable-next-line no-undef
const emit = defineEmits(["toggle-telegram-account-setup-modal"]);

const store: Store<StoreStateType> = useStore();

const telegramAuthService: ITelegramAuthService = inject(
  ServiceProviderKeys.TELEGRAM_AUTH_SERVICE
);

const showModalInFullScreen = ref<boolean>(false);
const showTelegramAccountSetupModalRef = ref<boolean>(false);

const isMobileNumberStep = ref<boolean>(false);
const phoneNumber = ref<string>("");
let phoneCodeHash = "";

const isAuthCodeStep = ref<boolean>(false);
const authCode = ref<string>("");

const isTwoFactorPasswordStep = ref<boolean>(false);
const showTwoFactorPassword = ref<boolean>(false);
const twoFactorPassword = ref<string>("");

const errorMessage = ref<string>("");

let screenWidth_$: Subscription;

function initialise(): void {
  reset();
}

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

async function onSendCode(): Promise<void> {
  try {
    if (!_.isEmpty(phoneNumber.value)) {
      const data = await telegramAuthService.sendCode(phoneNumber.value);
      phoneCodeHash = data.phoneCodeHash;

      isMobileNumberStep.value = false;
      isAuthCodeStep.value = true;

      errorMessage.value = "";
    } else {
      errorMessage.value = "Phone number is required";
    }
  } catch (error) {
    LoggerUtils.error("TelegramLoginPage", "onSendCode", error);

    errorMessage.value = error.message;
  }
}

async function onVerifyCode(): Promise<void> {
  try {
    if (!_.isEmpty(authCode.value)) {
      const { isPasswordRequired } = await telegramAuthService.signIn(
        phoneNumber.value,
        phoneCodeHash,
        authCode.value
      );

      isAuthCodeStep.value = false;

      if (!isPasswordRequired) {
        updateTelegramLoggedInState();
        onEmitCloseModal();
        reset();
      } else {
        isTwoFactorPasswordStep.value = true;
      }

      errorMessage.value = "";
    } else {
      errorMessage.value = "Verification code is required";
    }
  } catch (error) {
    LoggerUtils.error("TelegramLoginPage", "onVerifyCode", error);

    errorMessage.value = error.message;
  }
}

async function onTwoFactorPasswordEntered(): Promise<void> {
  try {
    if (!_.isEmpty(twoFactorPassword.value)) {
      await telegramAuthService.signInWithTwoFactorPassword(
        twoFactorPassword.value
      );

      updateTelegramLoggedInState();
      isTwoFactorPasswordStep.value = false;
      onEmitCloseModal();
      reset();

      errorMessage.value = "";
    } else {
      errorMessage.value = "Two factor password is required";
    }
  } catch (error) {
    LoggerUtils.error("TelegramLoginPage", "onTwoFactorPasswordEntered", error);

    errorMessage.value = error.message;
  }
}

function updateTelegramLoggedInState(): void {
  store.dispatch(TelegramStoreActions.UPDATE_IS_LOGGED_INTO_TELEGRAM, true);
}

function onEmitCloseModal(): void {
  emit("toggle-telegram-account-setup-modal");
}

function reset(): void {
  isMobileNumberStep.value = true;
  isAuthCodeStep.value = false;
  isTwoFactorPasswordStep.value = false;

  phoneNumber.value = "";
  authCode.value = "";
  twoFactorPassword.value = "";
  phoneCodeHash = "";
  errorMessage.value = "";
}

function onToggleTwoFactorPassword(): void {
  showTwoFactorPassword.value = !showTwoFactorPassword.value;
}

onUnmounted(() => {
  RxjsHelperUtils.unsubscribe(screenWidth_$);
});

initialise();
watchScreenWidth();

watchEffect(() => {
  showTelegramAccountSetupModalRef.value = props.showTelegramAccountSetupModal;
});
</script>

<style lang="scss" scoped>
.telegram-login-container {
  @apply p-4;

  .text-input-box {
    @apply my-4 p-2 text-black border border-solid border-black rounded-md;
  }

  .error-message {
    @apply my-2 text-sm text-red-500 font-bold;
  }

  .two-factor-password-input-container {
    @apply h-12 my-4 flex flex-row justify-center items-center border-2 border-solid border-black rounded-md;

    input {
      @apply focus:outline-none;
    }

    .two-factor-toggle-button-container {
      @apply h-full w-full flex flex-row border-l-2 border-gray-500;

      button {
        @apply h-3/5 w-3/5 mx-2 my-auto;
      }
    }
  }
}
</style>
