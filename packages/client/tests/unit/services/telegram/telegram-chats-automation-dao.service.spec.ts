import { lastValueFrom, of } from "rxjs";

import { ChatAutomation } from "@shared-core";

import ITelegramChatsAutomationDaoService, {
  ChatAutomationCreatedResultType,
} from "@/services/telegram/chats/i-telegram-chats-automation-dao.service";
import FirebaseTelegramChatsAutomationDaoService from "@/services/telegram/chats/firebase-telegram-chats-automation-dao.service";

const mockOf = of;
const mockLastValueFrom = lastValueFrom;

jest.mock(
  "@/services/telegram/chats/firebase-telegram-chats-automation-dao.service",
  () => {
    return jest.fn().mockImplementation(() => {
      const chatAutomations: ChatAutomation[] = [
        {
          uid: "1",
          name: "automation-one",
          sourceChatId: 1,
          destinationChatIds: [2],
          active: false,
          touched: false,
        },
        {
          uid: "2",
          name: "automation-two",
          sourceChatId: 2,
          destinationChatIds: [1],
          active: true,
          touched: true,
        },
      ];

      return {
        getAll: jest.fn(() => {
          return mockOf(chatAutomations);
        }),
        getOne: jest.fn((id: string) => {
          const chatAutomation = chatAutomations.find(
            (chatAutomation: ChatAutomation) => chatAutomation.uid === id
          );

          return mockOf(chatAutomation);
        }),
        create: jest.fn(() => {
          const newChatAutomation: ChatAutomation = {
            uid: "new_id",
            name: "automation-QnFvuKnVdQpwcXsbFRum6",
            sourceChatId: null,
            destinationChatIds: [],
            active: false,
            touched: false,
          };

          chatAutomations.push(newChatAutomation);

          return Promise.resolve({
            uid: newChatAutomation.uid,
          } as ChatAutomationCreatedResultType);
        }),
        update: jest.fn((id: string, data: Partial<ChatAutomation>) => {
          const chatAutomationToUpdate = chatAutomations.find(
            (chatAutomation: ChatAutomation) => chatAutomation.uid === id
          );

          const chatAutomationToUpdateIndex = chatAutomations.findIndex(
            (chatAutomation: ChatAutomation) => chatAutomation.uid === id
          );

          chatAutomations[chatAutomationToUpdateIndex] = {
            ...chatAutomationToUpdate,
            ...data,
          };

          return Promise.resolve();
        }),
        delete: jest.fn((id: string) => {
          const chatAutomationToDeleteIndex = chatAutomations.findIndex(
            (chatAutomation: ChatAutomation) => chatAutomation.uid === id
          );

          chatAutomations.splice(chatAutomationToDeleteIndex, 1);

          return Promise.resolve();
        }),
      };
    });
  }
);

describe("Telegram Chats Automation Dao Service", () => {
  let telegramChatsAutomationDaoService: ITelegramChatsAutomationDaoService;

  beforeEach(() => {
    telegramChatsAutomationDaoService =
      new FirebaseTelegramChatsAutomationDaoService();
  });

  it("should test that we can get all the chat automations", async () => {
    const chatAutomations = await mockLastValueFrom(
      telegramChatsAutomationDaoService.getAll()
    );

    expect(telegramChatsAutomationDaoService.getAll).toHaveBeenCalledTimes(1);
    expect(chatAutomations).toEqual([
      {
        uid: "1",
        name: "automation-one",
        sourceChatId: 1,
        destinationChatIds: [2],
        active: false,
        touched: false,
      },
      {
        uid: "2",
        name: "automation-two",
        sourceChatId: 2,
        destinationChatIds: [1],
        active: true,
        touched: true,
      },
    ] as ChatAutomation[]);
  });

  it("should test that we can get one chat automation", async () => {
    const chatAutomation: ChatAutomation = await mockLastValueFrom(
      telegramChatsAutomationDaoService.getOne("1")
    );

    expect(telegramChatsAutomationDaoService.getOne).toHaveBeenCalledTimes(1);
    expect(chatAutomation).toEqual({
      uid: "1",
      name: "automation-one",
      sourceChatId: 1,
      destinationChatIds: [2],
      active: false,
      touched: false,
    } as ChatAutomation);
  });

  it("should test that we can create a new chat automation", async () => {
    const { uid }: ChatAutomationCreatedResultType =
      await telegramChatsAutomationDaoService.create();

    const newlyCreatedChatAutomation: ChatAutomation = await mockLastValueFrom(
      telegramChatsAutomationDaoService.getOne("new_id")
    );

    expect(telegramChatsAutomationDaoService.create).toHaveBeenCalledTimes(1);
    expect(uid).toEqual("new_id");
    expect(newlyCreatedChatAutomation).toEqual({
      uid: "new_id",
      name: "automation-QnFvuKnVdQpwcXsbFRum6",
      sourceChatId: null,
      destinationChatIds: [],
      active: false,
      touched: false,
    } as ChatAutomation);
  });

  it("should test that we can update a chat automation", async () => {
    await telegramChatsAutomationDaoService.update("1", {
      destinationChatIds: [4, 5],
      active: true,
      touched: true,
    });

    const updatedChatAutomation: ChatAutomation = await mockLastValueFrom(
      telegramChatsAutomationDaoService.getOne("1")
    );

    expect(telegramChatsAutomationDaoService.update).toHaveBeenCalledTimes(1);
    expect(updatedChatAutomation).toEqual({
      uid: "1",
      name: "automation-one",
      sourceChatId: 1,
      destinationChatIds: [4, 5],
      active: true,
      touched: true,
    } as ChatAutomation);
  });

  it("should test that a chat automation is deleted", async () => {
    await telegramChatsAutomationDaoService.delete("2");

    const chatAutomations: ChatAutomation[] = await mockLastValueFrom(
      telegramChatsAutomationDaoService.getAll()
    );

    expect(telegramChatsAutomationDaoService.delete).toHaveBeenCalledTimes(1);
    expect(chatAutomations).toHaveLength(1);
    expect(chatAutomations).toEqual([
      {
        uid: "1",
        name: "automation-one",
        sourceChatId: 1,
        destinationChatIds: [2],
        active: false,
        touched: false,
      },
    ]);
  });
});
