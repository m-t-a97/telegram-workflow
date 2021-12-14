/**
 * An interface for interacting with the Telegram API for all Chat related activities.
 */
export interface ITelegramChatsService {
  /**
   * Gets all telegram chats
   * @returns {Promise<any[]>} All the chats
   */
  getAllChats(): Promise<any[]>;
}
