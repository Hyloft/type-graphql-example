import { User } from './../../entity/User';
import { createResolver } from './generics/CreateGeneric';
import { RegisterInput } from "./register/RegisterInput";

export const CreateUserResolver = createResolver(
    "User",
    User,
    RegisterInput,
    User
  );