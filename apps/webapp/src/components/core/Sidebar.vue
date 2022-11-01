<template>
  <va-sidebar
    id="sidebar"
    textColor="dark"
    color="rgb(44, 130, 224)"
    width="13rem"
    minimizedWidth="0"
    :minimized="!props.showSidebar"
    :gradient="true"
  >
    <va-sidebar-item>
      <router-link :to="`/${RoutePaths.DASHBOARD}`" @click="onToggleSidebar()">
        <va-sidebar-item-content>
          <va-icon name="dashboard" class="text-black" />
          <va-sidebar-item-title class="text-base font-bold text-black"
            >Dashboard</va-sidebar-item-title
          >
        </va-sidebar-item-content>
      </router-link>
    </va-sidebar-item>

    <va-sidebar-item>
      <router-link
        :to="`/${RoutePaths.DASHBOARD}/${RoutePaths.SETTINGS}`"
        @click="onToggleSidebar()"
      >
        <va-sidebar-item-content>
          <va-icon name="settings" class="text-black" />
          <va-sidebar-item-title class="text-base font-bold text-black"
            >Settings</va-sidebar-item-title
          >
        </va-sidebar-item-content>
      </router-link>
    </va-sidebar-item>
  </va-sidebar>
</template>

<script lang="ts" setup>
import {
  VaIcon,
  VaSidebar,
  VaSidebarItem,
  VaSidebarItemTitle,
  VaSidebarItemContent,
} from "vuestic-ui";

import { RoutePaths } from "@/constants/route-paths";

interface Props {
  showSidebar: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits(["toggle-sidebar"]);

function onToggleSidebar(): void {
  emit("toggle-sidebar");
}
</script>

<style lang="scss" scoped>
#sidebar {
  @apply w-56 pt-14 fixed;
}
</style>
