import { RouteRecordRaw } from "vue-router";

import { RoutePaths } from "@/constants/route-paths";
import LoginPage from "@/pages/home/LoginPage.vue";

const HOME_ROUTES: RouteRecordRaw[] = [
  {
    path: RoutePaths.HOME,
    name: "home",
    redirect: `/${RoutePaths.LOGIN}`,
  },
  {
    path: `/${RoutePaths.LOGIN}`,
    name: RoutePaths.LOGIN,
    component: LoginPage,
    meta: { requiresAuth: false, requiresTelegramLogin: false },
  },
];

export default HOME_ROUTES;
