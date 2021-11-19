import { RouteRecordRaw } from "vue-router";

import { RoutePaths } from "@/constants/route-paths";
import telegramChatAutomationWorkflowRouteGuard from "../guards/telegram/telegram-chat-automation-workflow-route.guard";

const CORE_ROUTES: RouteRecordRaw[] = [
  {
    path: `/${RoutePaths.DASHBOARD}`,
    name: RoutePaths.DASHBOARD,
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ "@/pages/core/dashboard/DashboardPage.vue"
      ),
    meta: { requiresAuth: true },
    children: [
      {
        path: RoutePaths.SETTINGS,
        name: RoutePaths.SETTINGS,
        component: () =>
          import(
            /* webpackChunkName: "settings" */ "@/pages/core/dashboard/settings/SettingsPage.vue"
          ),
      },
      {
        path: RoutePaths.CHATS,
        name: RoutePaths.CHATS,
        component: () =>
          import(
            /* webpackChunkName: "chats" */ "@/pages/core/dashboard/chats/ChatsPage.vue"
          ),
        meta: { requiresTelegramLogin: true },
      },
      {
        path: RoutePaths.CHAT_AUTOMATIONS,
        name: RoutePaths.CHAT_AUTOMATIONS,
        component: () =>
          import(
            /* webpackChunkName: "chat-automations" */ "@/pages/core/dashboard/chats/ChatAutomationsPage.vue"
          ),
        meta: { requiresTelegramLogin: true },
      },
      {
        path: RoutePaths.WORKFLOW,
        name: RoutePaths.WORKFLOW,
        component: () =>
          import(
            /* webpackChunkName: "workflow" */ "@/pages/core/workflow/WorkflowPage.vue"
          ),
        meta: { requiresTelegramLogin: true },
        children: [
          {
            path: `${RoutePaths.CHAT_AUTOMATION_WORKFLOW}/:id`,
            name: RoutePaths.CHAT_AUTOMATION_WORKFLOW,
            component: () =>
              import(
                /* webpackChunkName: "chat-automation-workflow" */ "@/pages/core/workflow/chats/ChatAutomationWorkflowPage.vue"
              ),
            props: true,
            beforeEnter: telegramChatAutomationWorkflowRouteGuard,
          },
        ],
      },
    ],
  },
];

export default CORE_ROUTES;
