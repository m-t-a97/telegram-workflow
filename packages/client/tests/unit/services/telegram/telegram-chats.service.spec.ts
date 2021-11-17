import TelegramAuthService from "@/services/telegram/auth/telegram-auth.service";
import ITelegramChatsService from "@/services/telegram/chats/i-telegram-chats.service";
import TelegramChatsService from "@/services/telegram/chats/telegram-chats.service";

jest.mock("@/services/telegram/chats/telegram-chats.service", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getAllChats: jest.fn((): Promise<any[]> => {
        return Promise.resolve([
          {
            className: "Channel",
            id: 123,
            accessHash: "1032669578780682892",
            title: "Channel",
          },
          {
            className: "Chat",
            id: 456,
            title: "Group",
            participantsCount: 4,
          },
        ]);
      }),
    };
  });
});

describe("Telegram Chats Service", () => {
  const telegramAuthService = new TelegramAuthService();
  let telegramChatsService: ITelegramChatsService;

  beforeEach(() => {
    telegramChatsService = new TelegramChatsService(telegramAuthService);
  });

  it("should test that we can get all the chats", async () => {
    const chats = await telegramChatsService.getAllChats();

    expect(chats).toEqual([
      {
        className: "Channel",
        id: 123,
        accessHash: "1032669578780682892",
        title: "Channel",
      },
      {
        className: "Chat",
        id: 456,
        title: "Group",
        participantsCount: 4,
      },
    ]);
  });
});
