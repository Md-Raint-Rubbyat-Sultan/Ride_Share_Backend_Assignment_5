import { model, Schema } from "mongoose";
import {
  IAuthProviders,
  IRoleChange,
  IsActive,
  IUser,
  Role,
  RoleStatus,
} from "./user.interface";
import bcrypt from "bcryptjs";
import { AppError } from "../../errorHelpers/AppError";
import { envVars } from "../../configs/env.config";

const RoleChangeSchema = new Schema<IRoleChange>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    currentRole: { type: String, enum: Role, required: true },
    requestedRole: { type: String, enum: Role, required: true },
    status: { type: String, enum: RoleStatus, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const RoleChange = model<IRoleChange>("RoleChange", RoleChangeSchema);

const authSchema = new Schema<IAuthProviders>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    auth: [authSchema],
    role: { type: String, default: Role.USER },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    picture: { type: String },
    isActive: { type: String, default: IsActive.ACTIVE },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.password) {
      if (this.isModified() || this.isNew) {
        this.password = await bcrypt.hash(
          this.password as string,
          Number(envVars.BCRYPT_SALT)
        );
      }
    }
    next();
  } catch (error: any) {
    throw new AppError(500, "Faild to hash password.");
  }
});

userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const updatedDoc = this.getUpdate() as IUser;
    if (updatedDoc.password) {
      const hashedPassword = await bcrypt.hash(
        updatedDoc.password,
        Number(envVars.BCRYPT_SALT)
      );
      updatedDoc.password = hashedPassword;
    }
    next();
  } catch (error) {
    throw new AppError(500, "Faild to update hashed password.");
  }
});

export const User = model<IUser>("User", userSchema);
