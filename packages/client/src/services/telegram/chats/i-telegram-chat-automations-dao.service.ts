import { ChatAutomation } from "@shared-core";

export type ChatAutomationCreatedResultType = {
  id: string;
};

/**
 * An interface for implementing custom telegram chat automations.
 */
export interface ITelegramChatAutomationsDaoService {
  /**
   * Creates a new chat automation
   * @returns {Promise<ChatAutomationCreatedResultType>} Promise<ChatAutomationCreatedResultType>
   */
  create(): Promise<ChatAutomationCreatedResultType>;

  /**
   * Gets all chat automations
   * @returns {Promise<ChatAutomation[]>} All the chat automations
   */
  getAll(): Promise<ChatAutomation[]>;

  /**
   * Gets one chat automation
   * @param {string} id - The chat automation id wanting to obtain
   * @returns {Promise<ChatAutomation>} The chat automation
   */
  getOne(id: string): Promise<ChatAutomation>;

  /**
   * Updates a chat automation
   * @param {string} id - The id of the chat automation to update
   * @param {Partial<ChatAutomation>} - The data needed to update the existing chat automation
   * @returns {Promise<void>} Promise<void>
   */
  update(id: string, data: Partial<ChatAutomation>): Promise<void>;

  /**
   * Deletes a chat automation
   * @param {string} id - The id of the chat automation to delete
   * @returns {Promise<void>} Promise<void>
   */
  delete(id: string): Promise<void>;
}
