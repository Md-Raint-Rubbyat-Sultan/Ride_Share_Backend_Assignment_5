import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { searchableFieldsInUser } from "./user.constants";
import {
  IAuthProviders,
  IRoleChange,
  IsActive,
  IUser,
  Role,
  RoleStatus,
} from "./user.interface";
import { RoleChange, User } from "./user.model";

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
    .filter()
    .search(searchableFieldsInUser)
    .sort()
    .fields()
    .paginate();

  let [data, meta] = await Promise.all([
    user.build().select("-password"),
    queryModel.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleUser = async (_id: string) => {
  const user = await User.findById(_id).select("-password");

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  return {
    data: user,
  };
};

const getMe = async (_id: string) => {
  const user = await User.findById(_id).select("-password");

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  return {
    data: user,
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role === Role.USER || decodedToken.role === Role.DRIVER) {
    if (userId !== decodedToken.userId) {
      throw new AppError(403, "Your are forbidden to update other users info.");
    }
  }

  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(404, "User not found.");
  }

  if (
    payload.role ||
    payload.isActive ||
    payload.isDeleted ||
    payload.isVerified
  ) {
    if (decodedToken.role !== Role.ADMIN) {
      throw new AppError(403, "Your are forbidden to update role.");
    }
  }

  if (
    !isUserExist.isVerified ||
    isUserExist.isActive === IsActive.INACTIVE ||
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isDeleted
  ) {
    throw new AppError(
      400,
      "Somethig went wrong. Please contact our tema. User either 'inactive' or 'blocked' or 'deleted' or 'not varified'"
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return { data: newUpdatedUser };
};

const getAllRoleChangeRequest = async (query: Record<string, string>) => {
  const queryModel = new QueryBuilder(RoleChange.find(), query);
  const requsetedChanges = queryModel.sort().paginate();

  const [data, meta] = await Promise.all([
    requsetedChanges.build(),
    queryModel.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};

const RoleChangeRequest = async (reqRole: string, decodedToken: JwtPayload) => {
  if (reqRole === Role.ADMIN && decodedToken.role === Role.ADMIN) {
    throw new AppError(400, "You are already an Admin");
  }

  if (
    (reqRole === Role.USER || reqRole === Role.DRIVER) &&
    (decodedToken.role === Role.DRIVER || decodedToken.role === Role.ADMIN)
  ) {
    throw new AppError(400, "Driver or Admin can't ba Driver or User again.");
  }

  const changeRequestPayload: IRoleChange = {
    userId: decodedToken.userId,
    currentRole: decodedToken.role,
    requestedRole: reqRole as Role,
    status: RoleStatus.PENDING,
  };

  const changedRoleRequest = await RoleChange.create(changeRequestPayload);

  return {
    data: changedRoleRequest,
  };
};

const updateRole = async (_id: string, payload: string) => {
  if (payload !== (RoleStatus.ACCEPTED || RoleStatus.CANCLED)) {
    throw new AppError(
      400,
      `Request miss matched. Request should be either ${RoleStatus.ACCEPTED} or ${RoleStatus.CANCLED}`
    );
  }

  const session = await RoleChange.startSession();
  session.startTransaction();

  try {
    const updatedRole = await RoleChange.findByIdAndUpdate(
      _id,
      {
        status: payload,
      },
      { new: true, runValidators: true, session }
    );

    if (!updatedRole) {
      throw new AppError(400, "Faild to updated user Role.");
    }

    await User.findByIdAndUpdate(
      updatedRole.userId,
      { role: updatedRole.requestedRole },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(400, "Faild to update role.");
  }
};

export const UserServices = {
  createUser,
  getAllUser,
  getSingleUser,
  getMe,
  updateUser,
  RoleChangeRequest,
  updateRole,
  getAllRoleChangeRequest,
};
