export interface ChatAutomation {
  id: string;
  name: string;
  sourceChatId: string;
  destinationChatIds: string[];
  active: boolean;
  touched: boolean;
}
