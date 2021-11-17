import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordNormalized,
} from "vue-router";

import _ from "lodash";

import { LoggerUtils } from "@shared-core";

import store from "@/store";
import { RoutePaths } from "@/constants/route-paths";
import { TelegramStoreActions } from "@/store/modules/telegram.store";
import { LocalStorageService } from "@/services/storage/local-storage.service";
import { LocalStorageKeys } from "@/constants/local-storage-keys";

const authRouteGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  try {
    // TODO: This could be improved in the future to somehow have multiple route guards.
    // Telegram route guard already exists but is not being used due to duplicate calls to the next() function.

    // Update state to also include whether the user is logged into telegram
    const savedTelegramSession = await LocalStorageService.getItem<string>(
      LocalStorageKeys.SAVED_TELEGRAM_SESSION
    );

    const hasTelegramSessionSavedToStorage = !_.isEmpty(savedTelegramSession);

    await store.dispatch(
      TelegramStoreActions.UPDATE_IS_LOGGED_INTO_TELEGRAM,
      hasTelegramSessionSavedToStorage
    );

    // -----------------------------------

    const requiresAuth: boolean = to.matched.some(
      (record: RouteRecordNormalized) => record.meta.requiresAuth
    );

    const authKey = await LocalStorageService.getItem<string>(
      LocalStorageKeys.AUTH_KEY
    );

    const isUserAuthorised: boolean = !_.isEmpty(authKey);

    if (requiresAuth) {
      if (isUserAuthorised) {
        next();
      } else {
        next({
          path: `/${RoutePaths.LOGIN}`,
        });
      }
    } else {
      if (isUserAuthorised) {
        next({
          path: `/${RoutePaths.DASHBOARD}`,
        });
      } else {
        next();
      }
    }
  } catch (error) {
    LoggerUtils.error("authRouteGuard", "", error);

    next({
      path: RoutePaths.HOME,
    });
  }
};

export default authRouteGuard;
