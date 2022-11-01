import { Observable } from "rxjs";

import { User } from "@/shared-core";

export interface IUserService {
  get(): Observable<User>;
  update(data: Partial<User>): Promise<void>;
}
