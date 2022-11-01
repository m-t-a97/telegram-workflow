<template>
  <div class="login-page-container">
    <va-card class="card-form-wrapper">
      <va-card-content>
        <va-form class="card-form">
          <h1 class="card-form-title">ENTER YOUR API KEY</h1>

          <va-input label="API Key" type="password" :rules="[inputValidation]" v-model="apiKey" />

          <p class="error-message" v-show="errorMessage !== ''">
            {{ errorMessage }}
          </p>

          <va-button color="success" :loading="isAttemptingSignIn" :disabled="!areAllFieldsValid || isAttemptingSignIn"
            @click.prevent="onSignIn()">SIGN IN</va-button>
        </va-form>
      </va-card-content>
    </va-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, inject } from "vue";
import { Router, useRouter } from "vue-router";

import _ from "lodash";
import { VaCard, VaCardContent, VaForm, VaInput, VaButton } from "vuestic-ui";

import { LoggerUtils } from "@/shared-core";

import { IAuthService } from "@/services/auth/i-auth.service";
import { ServiceProviderKeys } from "@/services/service-provider-keys";
import { RoutePaths } from "@/constants/route-paths";

const router: Router = useRouter();

const authService: IAuthService = inject(ServiceProviderKeys.AUTH_SERVICE);

const apiKey = ref<string>("");
const errorMessage = ref<string>("");

const areAllFieldsValid = computed<boolean>(() => !_.isEmpty(apiKey.value));

const isAttemptingSignIn = ref<boolean>(false);

const inputValidation = (value: string) =>
  (!_.isNil(value) && value.length > 0) || "Field is required";

async function onSignIn(): Promise<void> {
  try {
    if (areAllFieldsValid.value) {
      errorMessage.value = "";
      isAttemptingSignIn.value = true;

      await authService.signIn(apiKey.value.trim());
      await router.replace(RoutePaths.DASHBOARD);
    } else {
      errorMessage.value = "All fields must be filled in.";
    }

    isAttemptingSignIn.value = false;
  } catch (error) {
    LoggerUtils.error("LoginPage", "onSignIn", error);

    errorMessage.value = error.message;

    isAttemptingSignIn.value = false;
  }
}
</script>

<style lang="scss" scoped>
.login-page-container {
  @apply h-full w-full p-4 flex flex-row justify-center items-center;

  .card-form-wrapper {
    @apply m-auto w-full;

    .card-form {
      @apply flex flex-col justify-center items-center;

      .card-form-title {
        @apply mb-4 text-2xl font-bold;
      }

      .va-input-wrapper.va-input {
        @apply w-full mb-4;

        .va-input-wrapper__content {
          .va-input_solid .va-input__container {
            @apply p-12;
          }
        }
      }

      .error-message {
        @apply mb-4 text-sm font-bold text-red-500;
      }
    }
  }
}
</style>
