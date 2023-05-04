import { Blog } from "../../../models/blog.model.js";
import { BlogResDto } from "../../../dtos/response/blog.res.dto.js";
import { Comment } from "../../../models/comment.model.js";
import { Like } from "../../../models/like.model.js";
import { User } from "../../../models/user.model.js";
import { UserResDto } from "../../../dtos/response/user.res.dto.js";
import { database } from "../../../configs/database.config.js";

const createBlog = async (userId, blogPostReqDto) => {
  const user = await User.findByPk(userId, {
    attributes: ["id", "name", "profileImage"],
  });

  const blog = await Blog.create(blogPostReqDto);

  await blog.setUser(user);

  return new BlogResDto({
    id: blog.id,
    title: blog.title,
    content: blog.content,
    coverImage: blog.coverImage,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    user: new UserResDto(user),
    likes: [],
    commentCount: 0,
  });
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
      [database.fn("COUNT", database.col("comments.id")), "commentCount"],
    ],
    include: [
      {
        model: User,
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: Like,
        attributes: ["userId"],
      },
      {
        model: Comment,
        attributes: [],
      },
    ],
  });

  if (!blog) return null;

  return new BlogResDto({
    id: blog.id,
    title: blog.title,
    content: blog.content,
    coverImage: blog.coverImage,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    user: new UserResDto(blog.user),
    likes: blog.likes,
    commentCount: blog.get("commentCount"),
  });
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
      [database.fn("COUNT", database.col("comments.id")), "commentCount"],
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
      },
    ],
  });

  return {
    pageCount: Math.ceil(count.length / limit),
    blogs: blogs.map(
      (blog) =>
        new BlogResDto({
          id: blog.id,
          title: blog.title,
          content: blog.content,
          coverImage: blog.coverImage,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          user: new UserResDto(blog.user),
          likes: blog.likes,
          commentCount: blog.get("commentCount"),
        })
    ),
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
      [database.fn("COUNT", database.col("comments.id")), "commentCount"],
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
      },
    ],
  });

  return {
    pageCount: Math.ceil(count.length / limit),
    blogs: blogs.map(
      (blog) =>
        new BlogResDto({
          id: blog.id,
          title: blog.title,
          content: blog.content,
          coverImage: blog.coverImage,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          user: new UserResDto(blog.user),
          likes: blog.likes,
          commentCount: blog.get("commentCount"),
        })
    ),
  };
};

const updateBlog = async (blogId, blogUpdateReqDto) => {
  const [updatedRows] = await Blog.update(blogUpdateReqDto, {
    where: { id: blogId },
  });

  return updatedRows === 1;
};

const deleteBlog = async (blogId) => {
  const deletedRows = await Blog.destroy({
    where: { id: blogId },
  });

  return deletedRows === 1;
};

const updateBlogLike = async (userId, blogId) => {
  const like = await Like.findOne({
    where: { userId, blogId },
  });

  if (like) {
    await Like.destroy({ where: { userId, blogId } });
    return false;
  } else {
    await Like.create({ userId, blogId });
    return true;
  }
};

export const blogDB = {
  createBlog,
  getBlogById,
  getBlogs,
  getUserBlogs,
  updateBlog,
  deleteBlog,
  updateBlogLike,
};
