import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";

import { RoutePaths } from "@/constants/route-paths";
import NotFoundPage from "@/pages/home/NotFoundPage.vue";
import HOME_ROUTES from "./routes/home.routes";
import CORE_ROUTES from "./routes/core.routes";
import authRouteGuard from "./guards/auth/auth.guard";
import telegramRouteGuard from "./guards/telegram/telegram-route.guard";

const routes: RouteRecordRaw[] = [
  ...HOME_ROUTES,
  ...CORE_ROUTES,
  {
    path: "/:pathMatch(.*)*",
    redirect: `/${RoutePaths.NOT_FOUND}`,
  },
  {
    path: `/${RoutePaths.NOT_FOUND}`,
    name: RoutePaths.NOT_FOUND,
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    await authRouteGuard(to, from, next);
  }
);

export default router;
