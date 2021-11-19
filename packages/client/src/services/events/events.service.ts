import { Subject } from "rxjs";

export class EventsService {
  public static readonly chatAutomationsUpdater$ = new Subject<void>();
}
