import asyncHandler from "express-async-handler";

const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
});

const getUserList = asyncHandler(async (req, res) => {
  let { page, limit, sort, keyword = "" } = req.query;
  page = parseInt(page > 0 ? page : 1);
  limit = parseInt(limit > 0 ? limit : 12);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { name, email, birthDate, gender, password } = req.body;
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { oldPassword, newPassword } = req.body;
});

const updateUserProfileImage = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const profileImage = req.file?.filename;
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const coverImage = req.file?.filename;
});

export const userController = {
  getUser,
  getUserList,
  updateUserProfile,
  updateUserPassword,
  updateUserProfileImage,
  updateUserCoverImage,
};
