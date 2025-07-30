import { AppError } from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { searchableFieldsInUser } from "./user.constants";
import { IAuthProviders, IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const isUserExist = await User.findOne({ email: payload.email });

  if (isUserExist) {
    throw new AppError(400, "User already exist");
  }

  const authProvider: IAuthProviders = {
    provider: "credentials",
    providerId: payload.email as string,
  };

  const user = await User.create({
    ...payload,
    auth: [authProvider],
  });

  return {
    data: user,
  };
};

const getAllUser = async (query: Record<string, string>) => {
  const queryModel = new QueryBuilder(User.find(), query);
  const user = queryModel
    .search(searchableFieldsInUser)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([user.build(), queryModel.getMeta()]);

  return {
    data,
    meta,
  };
};

export const UserServices = {
  createUser,
  getAllUser,
};
