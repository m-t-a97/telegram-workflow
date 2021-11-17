import { Store, useStore } from "vuex";

import { ChatAutomation } from "@shared-core";

import { StoreStateType } from "@/store";

type FetchChatAutomationHookType = {
  fetchChatAutomation: (id: string) => ChatAutomation;
};

const useFetchTelegramChatAutomation = (): FetchChatAutomationHookType => {
  const store: Store<StoreStateType> = useStore();

  const fetchChatAutomation = (id: string): ChatAutomation => {
    const chatAutomations = [...store.state.telegramStore.chatAutomations];

    return chatAutomations.find(
      (chatAutomation: ChatAutomation) => chatAutomation.uid === id
    );
  };

  return {
    fetchChatAutomation,
  };
};

export default useFetchTelegramChatAutomation;
