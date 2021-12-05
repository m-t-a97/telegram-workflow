export interface ChatAutomation {
  id: string;
  name: string;
  sourceChatId: number;
  destinationChatIds: number[];
  active: boolean;
  touched: boolean;
}
