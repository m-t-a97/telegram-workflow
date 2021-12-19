export type AuthStoreStateType = {
  apiKey: string;
};

const state: AuthStoreStateType = {
  apiKey: "",
};

enum AuthStoreActionTypes {
  SET_API_KEY = "SET_API_KEY",
}

const mutations = {
  [AuthStoreActionTypes.SET_API_KEY](
    state: AuthStoreStateType,
    apiKey: string
  ): void {
    state.apiKey = apiKey;
  },
};

const actions = {
  [AuthStoreActionTypes.SET_API_KEY]: ({ commit }, apiKey: string): void => {
    commit(AuthStoreActionTypes.SET_API_KEY, apiKey);
  },
};

const storeKey = "authStore";

export const AuthStoreActions = {
  [AuthStoreActionTypes.SET_API_KEY]: `${storeKey}/${AuthStoreActionTypes.SET_API_KEY}`,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
