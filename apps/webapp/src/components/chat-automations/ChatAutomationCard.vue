<script setup lang="ts">
import { VaCard, VaCardContent } from "vuestic-ui";

import { ChatAutomation } from "@/shared-core";

defineProps<{
  chatAutomation: ChatAutomation;
}>();
</script>

<template>
  <router-link :to="`/workflow/chat-automation-workflow/${chatAutomation.id}`">
    <va-card>
      <va-card-content>
        <div class="flex flex-row justify-between items-center">
          <p>{{ chatAutomation.name }}</p>

          <p class="text-base font-bold" :class="{
            'text-green-500': chatAutomation.active,
            'text-red-500': !chatAutomation.active,
          }">
            {{ chatAutomation.active ? "ACTIVE" : "INACTIVE" }}
          </p>
        </div>
      </va-card-content>
    </va-card>
  </router-link>
</template>
