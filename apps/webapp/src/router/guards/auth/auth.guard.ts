import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordNormalized,
} from "vue-router";

import _ from "lodash";

import { LoggerUtils } from "@/shared-core";

import store, { StoreStateType } from "@/store/index";
import { AuthStoreActions } from "@/store/modules/auth.store";
import { RoutePaths } from "@/constants/route-paths";
import { LocalStorageService } from "@/services/storage/local-storage.service";
import { LocalStorageKeys } from "@/constants/local-storage-keys";

const authRouteGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  try {
    const requiresAuth: boolean = to.matched.some(
      (record: RouteRecordNormalized) => record.meta.requiresAuth
    );

    const apiKey = await LocalStorageService.getItem<string>(
      LocalStorageKeys.API_KEY
    );

    if (!_.isNil(apiKey)) {
      await store.dispatch(AuthStoreActions.SET_API_KEY, apiKey);
    }

    const isUserAuthorised: boolean = !_.isEmpty(apiKey);

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
