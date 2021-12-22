import _ from "lodash";
import { Subscription } from "rxjs";

export class RxjsHelperUtils {
  public static unsubscribe(subscription: Subscription): void {
    subscription?.unsubscribe();
  }

  public static unsubscribeAll(subscriptions: Subscription[]): void {
    if (!_.isEmpty(subscriptions)) {
      subscriptions.forEach((subscription: Subscription) =>
        subscription?.unsubscribe()
      );
    }
  }
}
