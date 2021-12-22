import _ from "lodash";
import { Api } from "telegram";

import { ChatAutomation } from "@shared-core";

export type TelegramStoreStateType = {
  isLoggedIn: boolean;
  chats: Api.TypeChat[];
  chatAutomations: ChatAutomation[];
};

const state: TelegramStoreStateType = {
  isLoggedIn: false,
  chats: [],
  chatAutomations: [],
};

enum TelegramStoreActionTypes {
  UPDATE_IS_LOGGED_INTO_TELEGRAM = "UPDATE_IS_LOGGED_INTO_TELEGRAM",
  UPDATE_TELEGRAM_CHATS = "UPDATE_TELEGRAM_CHATS",
  UPDATE_TELEGRAM_CHAT_AUTOMATIONS = "UPDATE_TELEGRAM_CHAT_AUTOMATIONS",
}

const mutations = {
  [TelegramStoreActionTypes.UPDATE_IS_LOGGED_INTO_TELEGRAM](
    state: TelegramStoreStateType,
    isLoggedIn: boolean
  ): void {
    state.isLoggedIn = isLoggedIn;
  },
  [TelegramStoreActionTypes.UPDATE_TELEGRAM_CHATS](
    state: TelegramStoreStateType,
    chats: Api.TypeChat[]
  ): void {
    state.chats = chats;
  },
  [TelegramStoreActionTypes.UPDATE_TELEGRAM_CHAT_AUTOMATIONS](
    state: TelegramStoreStateType,
    chatAutomations: ChatAutomation[]
  ): void {
    state.chatAutomations = chatAutomations;
  },
};

const actions = {
  [TelegramStoreActionTypes.UPDATE_IS_LOGGED_INTO_TELEGRAM]: (
    { commit },
    isLoggedIn: boolean
  ): void => {
    commit(TelegramStoreActionTypes.UPDATE_IS_LOGGED_INTO_TELEGRAM, isLoggedIn);
  },
  [TelegramStoreActionTypes.UPDATE_TELEGRAM_CHATS]: (
    { commit },
    chats: Api.TypeChat[]
  ): void => {
    commit(TelegramStoreActionTypes.UPDATE_TELEGRAM_CHATS, chats);
  },
  [TelegramStoreActionTypes.UPDATE_TELEGRAM_CHAT_AUTOMATIONS]: (
    { commit },
    chatAutomations: ChatAutomation[]
  ): void => {
    commit(
      TelegramStoreActionTypes.UPDATE_TELEGRAM_CHAT_AUTOMATIONS,
      chatAutomations
    );
  },
};

const storeKey = "telegramStore";

export const TelegramStoreActions = {
  [TelegramStoreActionTypes.UPDATE_IS_LOGGED_INTO_TELEGRAM]: `${storeKey}/${TelegramStoreActionTypes.UPDATE_IS_LOGGED_INTO_TELEGRAM}`,
  [TelegramStoreActionTypes.UPDATE_TELEGRAM_CHATS]: `${storeKey}/${TelegramStoreActionTypes.UPDATE_TELEGRAM_CHATS}`,
  [TelegramStoreActionTypes.UPDATE_TELEGRAM_CHAT_AUTOMATIONS]: `${storeKey}/${TelegramStoreActionTypes.UPDATE_TELEGRAM_CHAT_AUTOMATIONS}`,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
