import { createLogger, createStore } from "vuex";

import _ from "lodash";

import telegramStore, {
  TelegramStoreStateType,
} from "./modules/telegram.store";
import userStore, { UserStoreStateType } from "./modules/user.store";

const debugModeEnabled = !_.isEqual(process.env.NODE_ENV, "production");

export type StoreStateType = {
  telegramStore: TelegramStoreStateType;
  userStore: UserStoreStateType;
};

export default createStore({
  strict: debugModeEnabled,
  plugins: debugModeEnabled ? [createLogger()] : [],
  modules: { telegramStore, userStore },
});
