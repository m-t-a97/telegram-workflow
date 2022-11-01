import { User } from "@/shared-core";

export type UserStoreStateType = {
  user: User;
};

const state: UserStoreStateType = {
  user: null,
};

enum UserStoreActionTypes {
  UPDATE_USER = "UPDATE_USER",
}

const mutations = {
  [UserStoreActionTypes.UPDATE_USER](
    state: UserStoreStateType,
    user: User
  ): void {
    state.user = user;
  },
};

const actions = {
  [UserStoreActionTypes.UPDATE_USER]: ({ commit }, user: User): void => {
    commit(UserStoreActionTypes.UPDATE_USER, user);
  },
};

const storeKey = "userStore";

export const UserStoreActions = {
  [UserStoreActionTypes.UPDATE_USER]: `${storeKey}/${UserStoreActionTypes.UPDATE_USER}`,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
