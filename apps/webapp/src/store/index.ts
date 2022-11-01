import { createLogger, createStore } from "vuex";

import { isEqual } from "lodash";

import authStore, { AuthStoreStateType } from "./modules/auth.store";
import telegramStore, {
  TelegramStoreStateType,
} from "./modules/telegram.store";
import userStore, { UserStoreStateType } from "./modules/user.store";

const debugModeEnabled = !isEqual(process.env.NODE_ENV, "production");

export type StoreStateType = {
  authStore: AuthStoreStateType;
  telegramStore: TelegramStoreStateType;
  userStore: UserStoreStateType;
};

export default createStore({
  strict: debugModeEnabled,
  plugins: debugModeEnabled ? [createLogger()] : [],
  modules: { authStore, telegramStore, userStore },
});
