-- CreateTable
CREATE TABLE "ChatAutomation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceChatId" TEXT,
    "destinationChatIds" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT false,
    "touched" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ChatAutomation_pkey" PRIMARY KEY ("id")
);
