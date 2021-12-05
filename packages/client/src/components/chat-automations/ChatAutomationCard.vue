<template>
  <router-link
    :to="`/workflow/chat-automation-workflow/${props.chatAutomation.id}`"
  >
    <va-card>
      <va-card-content>
        <div class="flex flex-row justify-between items-center">
          <p>{{ props.chatAutomation.name }}</p>

          <p
            class="text-base font-bold"
            :class="{
              'text-green-500': props.chatAutomation.active,
              'text-red-500': !props.chatAutomation.active,
            }"
          >
            {{ props.chatAutomation.active ? "ACTIVE" : "INACTIVE" }}
          </p>
        </div>
      </va-card-content>
    </va-card>
  </router-link>
</template>

<script lang="ts" setup>
import { VaCard, VaCardContent } from "vuestic-ui";

import { ChatAutomation } from "@shared-core";

interface Props {
  chatAutomation: ChatAutomation;
}

// eslint-disable-next-line no-undef
const props = defineProps<Props>();
</script>

<style lang="scss" scoped></style>
