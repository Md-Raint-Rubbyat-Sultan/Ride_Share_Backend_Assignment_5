import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(new Date().setDate(now.getDate() - 7));
const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30));

const userStats = async () => {
  const totalUsersPromise = User.countDocuments();
  const totalUserInLastSevenDaysPromise = User.countDocuments();
  const totlaUserInLastThirtyDaysPromise = User.countDocuments();

  const totalUserAccordingTheirRolePromise = User.aggregate([
    {
      $group: {
        _id: "$role",
        total: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    totalUserInLastSevenDays,
    totlaUserInLastThirtyDays,
    totalUserAccordingTheirRole,
  ] = await Promise.all([
    totalUsersPromise,
    totalUserInLastSevenDaysPromise,
    totlaUserInLastThirtyDaysPromise,
    totalUserAccordingTheirRolePromise,
  ]);

  return {
    data: {
      totalUsers,
      totalUserInLastSevenDays,
      totlaUserInLastThirtyDays,
      totalUserAccordingTheirRole,
    },
  };
};

export const statsServices = { userStats };
