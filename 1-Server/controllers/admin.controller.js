import User from "../models/user.models.js";

export const getAdminStats = async (req, res) => {
  const allUserCount = await User.countDocuments();

  const subscribeCount = await User.countDocuments({
    subscribedCourses: { $exists: true, $ne: [] },
  });

  res.status(200).json({
    success: true,
    allUserCount,
    subscribeCount,
  });
};
