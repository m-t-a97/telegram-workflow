import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Job, Queue, QueueEvents, Worker } from "bullmq";
import EventEmitter from "events";
import { ChatAutomation, LoggerUtils } from "@autogram/shared-core";
import _ from "lodash";
import os from "os";

import constants from "src/constants/constants";
import { EnvironmentVariables } from "src/constants/environment-variables";
import { AbstractChatAutomationService } from "./abstract-chat-automation.service";

@Injectable()
export class TelegramChatAutomationService
  implements AbstractChatAutomationService
{
  private queue: Queue;
  private events: EventEmitter[];
  private chatAutomationsUserMap: Record<
    string,
    {
      telegramSessionKey: string;
      automations: Record<string, Partial<ChatAutomation>>;
    }
  > = {};

  private chatAutomations: ChatAutomation[] = [];

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>
  ) {
    // this.initialiseQueueAndWorkers();
    // this.executeChatAutomations();
    // this.chatAutomationWorker.on("active", (job: Job, prev: any) => {
    //   console.log("active", job.id);
    // });
    // this.chatAutomationWorker.on("progress", (job: Job, progress: number | object) => {
    //   console.log("progress", job.id, progress);
    // });
    // this.chatAutomationWorker.on("completed", (job: Job, returnvalue: any) => {
    //   console.log("completed", job.id, returnvalue);
    // });
    // this.chatAutomationWorker.on("failed", (job: Job, failedReason: string) => {
    //   console.error("failed", job.id);
    // });
    // this.chatAutomationWorker.on("error", (error: any) => {
    //   console.error(error);
    // });
  }

  private async initialiseQueueAndWorkers(): Promise<void> {
    this.queue = new Queue(constants.queue.chatAutomationsQueueKey, {
      connection: {
        host: this.configService.get<string>("HOST"),
        port: 6379,
      },
    });

    const queueEvents = new QueueEvents(
      constants.queue.chatAutomationsQueueKey,
      {
        connection: {
          host: this.configService.get<string>("HOST"),
          port: 6379,
        },
      }
    );

    queueEvents.on("completed", ({ jobId, returnvalue }) => {
      LoggerUtils.log(
        "TelegramChatAutomationService",
        "initialiseQueueAndWorkers",
        `[Completed job]: ${jobId},`,
        returnvalue
      );
    });

    queueEvents.on("failed", ({ jobId, failedReason }) => {
      LoggerUtils.error(
        "TelegramChatAutomationService",
        "initialiseQueueAndWorkers",
        `[Failed job]: ${jobId}`,
        failedReason
      );
    });

    const job = async (job: Job): Promise<any> => {
      if (_.isEqual(job.name, constants.queue.chatAutomationJobKey)) {
        // TODO: do the logic of forwarding messages here
        LoggerUtils.log(
          "TelegramChatAutomationService",
          "initialiseQueueAndWorkers",
          `Processing job ${job.id} of type ${job.name}`
        );
      }
    };

    const workers: Worker[] = [];

    for (let i = 0; i < os.cpus().length; i++) {
      const worker = new Worker(constants.queue.chatAutomationsQueueKey, job, {
        connection: {
          host: this.configService.get<string>("HOST"),
          port: 6379,
        },
      });

      workers.push(worker);
    }
  }

  public async activate(data: {
    idToken: string;
    telegramSessionKey: string;
    chatAutomation: ChatAutomation;
  }): Promise<any> {
    try {
      // if (_.isNil(this.chatAutomationsUserMap[userId])) {
      //   this.chatAutomationsUserMap[userId] = {
      //     telegramSessionKey: data.telegramSessionKey,
      //     automations: {
      //       [data.chatAutomation.uid]: data.chatAutomation,
      //     },
      //   };
      // } else {
      //   this.chatAutomationsUserMap[userId].automations[
      //     data.chatAutomation.uid
      //   ] = data.chatAutomation;
      // }

      // LoggerUtils.log(
      //   "TelegramChatAutomationService",
      //   "activate",
      //   this.chatAutomationsUserMap[userId]
      // );

      // await this.queue.add(constants.queue.chatAutomationJobKey, {
      //   uid: userId,
      //   chatAutomation: data.chatAutomation,
      // });

      return {
        message: `Added new chat automation`,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async deactivate(data: {
    idToken: string;
    chatAutomation: ChatAutomation;
  }): Promise<any> {
    // delete this.chatAutomationsUserMap[userId]?.automations[
    //   data.chatAutomation.uid
    // ];
    // LoggerUtils.log(
    //   "TelegramChatAutomationService",
    //   "deactivate",
    //   this.chatAutomationsUserMap[userId]
    // );
  }

  private async executeChatAutomations(): Promise<void> {
    try {
      // ------------------------------------------------------------------------
      // And also listen for new telegram messages
      // ------------------------------------------------------------------------
      // this.client.addEventHandler(callback, new NewMessage({}));
    } catch (error) {
      LoggerUtils.error(
        "TelegramChatAutomationService",
        "executeChatAutomations",
        error
      );
    }
  }
}
