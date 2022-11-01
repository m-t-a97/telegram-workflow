import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordNormalized,
} from "vue-router";

import _ from "lodash";

import { LoggerUtils } from "@/shared-core";

import { RoutePaths } from "@/constants/route-paths";
import store from "@/store";
import { LocalStorageService } from "@/services/storage/local-storage.service";
import { LocalStorageKeys } from "@/constants/local-storage-keys";
import { TelegramStoreActions } from "@/store/modules/telegram.store";

const telegramRouteGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  try {
    const requiresTelegramLogin: boolean = to.matched.some(
      (record: RouteRecordNormalized) => record.meta.requiresTelegramLogin
    );

    const savedTelegramSession = await LocalStorageService.getItem<string>(
      LocalStorageKeys.SAVED_TELEGRAM_SESSION
    );

    const hasTelegramSessionSavedToStorage = !_.isEmpty(savedTelegramSession);

    await store.dispatch(
      TelegramStoreActions.UPDATE_IS_LOGGED_INTO_TELEGRAM,
      hasTelegramSessionSavedToStorage
    );

    if (requiresTelegramLogin) {
      if (hasTelegramSessionSavedToStorage) {
        next();
      } else {
        next({
          path: `/${RoutePaths.DASHBOARD}/${RoutePaths.SETTINGS}`,
        });
      }
    } else {
      if (hasTelegramSessionSavedToStorage) {
        next({
          path: `/${RoutePaths.DASHBOARD}`,
        });
      } else {
        next();
      }
    }
  } catch (error) {
    LoggerUtils.error("telegramRouteGuard", "", error);

    next({
      path: RoutePaths.HOME,
    });
  }
};

export default telegramRouteGuard;
