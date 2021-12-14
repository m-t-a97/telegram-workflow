import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class AbstractChatsService {
  public abstract fetchChats(): Promise<any>;
}
