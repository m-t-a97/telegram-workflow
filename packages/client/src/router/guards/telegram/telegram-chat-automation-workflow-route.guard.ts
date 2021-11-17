import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import _ from "lodash";

import { ChatAutomation } from "@shared-core";

import store, { StoreStateType } from "@/store";
import { RoutePaths } from "@/constants/route-paths";

const telegramChatAutomationWorkflowRouteGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<any> => {
  const chatAutomations: ChatAutomation[] = (store.state as StoreStateType)
    .telegramStore.chatAutomations;

  const foundChatAutomation = chatAutomations.find(
    (chatAutomation: ChatAutomation) =>
      _.isEqual(chatAutomation.uid, to.params.id)
  );

  if (_.isNil(foundChatAutomation)) {
    next({
      name: RoutePaths.NOT_FOUND,
    });
  } else {
    next();
  }
};

export default telegramChatAutomationWorkflowRouteGuard;
