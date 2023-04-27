import asyncHandler from "express-async-handler";

// @desc Get user profile details
// @route GET /user/profile/:userId
// @access Protected
const getUserDetails = asyncHandler(async (req, res) => {
  const userId = req.params?.userId;
});

// @desc Get list of users
// @route GET /user/users?page=Number&limit=Number&keyword=String
// @access Protected
const getUserList = asyncHandler(async (req, res) => {
  let { page, limit, sort, keyword = "" } = req.query;
  page = parseInt(page > 0 ? page : 1);
  limit = parseInt(limit > 0 ? limit : 12);
});

// @desc Update user profile
// @route PATCH /user/profile
// @access Protected
// @needs password and fields to update
const updateUserProfile = asyncHandler(async (req, res) => {
  const id = req.user?.id;
  const { name, email, birthDate, gender, password } = req.body;
  const profileImage = req.file?.filename;
  const removeProfileImage =
    !profileImage && parseInt(req.body.removeProfileImage) === 1;
});

// @desc Update user password
// @route PUT /user/password
// @access Protected
// @needs oldPassword, newPassword
const updateUserPassword = asyncHandler(async (req, res) => {
  const id = req.user?.id;
  const { oldPassword, newPassword } = req.body;
});

// @desc Update user profile image
// @route PUT /user/profileimage
// @access Protected
// @needs profileImage
const updateUserProfileImage = asyncHandler(async (req, res) => {
  const id = req.user?.id;
  const profileImage = req.file?.filename;
});

// @desc Update user cover image
// @route PUT /user/coverimage
// @access Protected
// @needs coverImage
const updateUserCoverImage = asyncHandler(async (req, res) => {
  const id = req.user?.id;
  const coverImage = req.file?.filename;
});

export const userController = {
  getUserDetails,
  getUserList,
  updateUserProfile,
  updateUserPassword,
  updateUserProfileImage,
  updateUserCoverImage,
};
