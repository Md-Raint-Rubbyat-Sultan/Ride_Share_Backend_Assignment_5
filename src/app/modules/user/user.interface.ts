export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  DRIVER = "DRIVER",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IAuthProviders {
  provider: "credentials" | "google";
  providerId: string;
}

export interface IUser {
  name: string;
  auth: IAuthProviders[];
  role: Role;
  email: string;
  password?: string;
  phone: string;
  address: string;
  isActive?: IsActive;
  isDeleted?: boolean;
  isVerified?: boolean;
  picture?: string;
  createdAt?: Date;
}
