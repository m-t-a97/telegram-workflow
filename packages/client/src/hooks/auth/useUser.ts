import { inject } from "vue";

import { Observable } from "rxjs";

import { User } from "@shared-core";

import { IUserService } from "@/services/user/i-user.service";
import { ServiceProviderKeys } from "@/services/service-provider-keys";

type UserHookType = {
  fetchUser: () => Observable<User>;
};

const useUser = (): UserHookType => {
  const userService: IUserService = inject(ServiceProviderKeys.USER_SERVICE);

  const fetchUser = (): Observable<User> => {
    return userService.get();
  };

  return {
    fetchUser,
  };
};

export default useUser;
