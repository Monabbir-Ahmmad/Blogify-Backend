import { Op, Sequelize } from "sequelize";

import { Blog } from "../../../models/blog.model.js";
import { Comment } from "../../../models/comment.model.js";
import { Like } from "../../../models/like.model.js";
import { User } from "../../../models/user.model.js";

const createBlog = async (userId, blogPostReqDto) => {
  const blog = await Blog.create({ ...blogPostReqDto, userId });

  if (!blog) return null;

  await blog.reload({
    include: [
      {
        model: User,
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: Like,
        attributes: ["userId"],
        required: false,
      },
    ],
  });

  return blog;
};

const getBlogById = async (id) => {
  const blog = await Blog.findByPk(id, {
    attributes: [
      "id",
      "title",
      "content",
      "coverImage",
      "createdAt",
      "updatedAt",
      [Sequelize.fn("COUNT", Sequelize.col("comments.id")), "commentCount"],
    ],
    include: [
      {
        model: User,
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: Like,
        attributes: ["userId"],
        required: false,
      },
      {
        model: Comment,
        attributes: [],
        required: false,
        where: { parentId: null },
      },
    ],
  });

  if (!blog?.id) return null;

  return blog;
};

const getBlogs = async (offset, limit) => {
  const { rows: blogs, count } = await Blog.findAndCountAll({
    subQuery: false,
    group: ["Blog.id"],
    offset,
    limit,
    attributes: [
      "id",
      "title",
      "content",
      "coverImage",
      "createdAt",
      "updatedAt",
      [Sequelize.fn("COUNT", Sequelize.col("comments.id")), "commentCount"],
    ],
    include: [
      {
        model: User,
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: Like,
        attributes: ["userId"],
        required: false,
      },
      {
        model: Comment,
        attributes: [],
        required: false,
        where: { parentId: null },
      },
    ],
  });

  return {
    pageCount: Math.ceil(count.length / limit),
    blogs,
  };
};

const getUserBlogs = async (userId, offset, limit) => {
  const { rows: blogs, count } = await Blog.findAndCountAll({
    where: { userId },
    subQuery: false,
    group: ["Blog.id"],
    offset,
    limit,
    attributes: [
      "id",
      "title",
      "content",
      "coverImage",
      "createdAt",
      "updatedAt",
      [Sequelize.fn("COUNT", Sequelize.col("comments.id")), "commentCount"],
    ],
    include: [
      {
        model: User,
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: Like,
        attributes: ["userId"],
        required: false,
      },
      {
        model: Comment,
        attributes: [],
        required: false,
        where: { parentId: null },
      },
    ],
  });

  return {
    pageCount: Math.ceil(count.length / limit),
    blogs,
  };
};

const updateBlog = async (blogId, blogUpdateReqDto) => {
  const blog = await getBlogById(blogId);

  if (!blog) return null;

  await blog.update(blogUpdateReqDto);

  return blog;
};

const deleteBlog = async (blogId) => {
  const blog = await getBlogById(blogId);

  if (!blog) return false;

  await blog.destroy();

  return true;
};

const updateBlogLike = async (userId, blogId) => {
  const [like, created] = await Like.findOrCreate({
    where: { userId, blogId },
    defaults: { userId, blogId },
  });

  if (!created && like) await like.destroy();

  return created;
};

const searchBlogByTitle = async (keyword, offset, limit) => {
  const { rows: blogs, count } = await Blog.findAndCountAll({
    where: { title: { [Op.substring]: keyword } },
    subQuery: false,
    group: ["Blog.id"],
    offset,
    limit,
    attributes: [
      "id",
      "title",
      "content",
      "coverImage",
      "createdAt",
      "updatedAt",
      [Sequelize.fn("COUNT", Sequelize.col("comments.id")), "commentCount"],
    ],

    include: [
      {
        model: User,
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: Like,
        attributes: ["userId"],
        required: false,
      },
      {
        model: Comment,
        attributes: [],
        required: false,
        where: { parentId: null },
      },
    ],
  });

  return {
    pageCount: Math.ceil(count.length / limit),
    blogs,
  };
};

export const blogDB = {
  createBlog,
  getBlogById,
  getBlogs,
  getUserBlogs,
  updateBlog,
  deleteBlog,
  updateBlogLike,
  searchBlogByTitle,
};
