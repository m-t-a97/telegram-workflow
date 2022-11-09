<script setup lang="ts">
import {
  VaIcon,
  VaSidebar,
  VaSidebarItem,
  VaSidebarItemTitle,
  VaSidebarItemContent,
} from "vuestic-ui";

import { RoutePaths } from "@/constants/route-paths";

defineProps<{
  showSidebar: boolean;
}>();

const emit = defineEmits(["toggle-sidebar"]);

function onToggleSidebar(): void {
  console.log("toggled");

  emit("toggle-sidebar");
}
</script>

<template>
  <va-sidebar class="pt-14 fixed" textColor="dark" color="rgb(44, 130, 224)" width="13rem" minimizedWidth="0"
    :minimized="!showSidebar" :gradient="true">
    <va-sidebar-item>
      <router-link :to="`/${RoutePaths.DASHBOARD}`" @click="onToggleSidebar()">
        <va-sidebar-item-content>
          <va-icon name="dashboard" class="text-black" />
          <va-sidebar-item-title class="text-base font-bold text-black">Dashboard</va-sidebar-item-title>
        </va-sidebar-item-content>
      </router-link>
    </va-sidebar-item>

    <va-sidebar-item>
      <router-link :to="`/${RoutePaths.DASHBOARD}/${RoutePaths.SETTINGS}`" @click="onToggleSidebar()">
        <va-sidebar-item-content>
          <va-icon name="settings" class="text-black" />
          <va-sidebar-item-title class="text-base font-bold text-black">Settings</va-sidebar-item-title>
        </va-sidebar-item-content>
      </router-link>
    </va-sidebar-item>
  </va-sidebar>
</template>
