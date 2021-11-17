export interface ChatAutomation {
  uid: string;
  name: string;
  sourceChatId: number;
  destinationChatIds: number[];
  active: boolean;
  touched: boolean;
}
