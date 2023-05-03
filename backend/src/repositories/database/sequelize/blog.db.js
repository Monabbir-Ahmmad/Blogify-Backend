import { BlogResDto } from "../../../dtos/response/blog.res.dto.js";
import { Blog } from "../../../models/blog.model.js";
import { Like } from "../../../models/like.model.js";
import { User } from "../../../models/user.model.js";

const createBlog = async (userId, blogPostReqDto) => {
  const user = await User.findByPk(userId, {
    attributes: ["id", "name", "email", "profileImage"],
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
    user,
    likes: [],
  });
};

const getBlogById = async (id) => {
  const blog = await Blog.findByPk(id, {
    include: [
      {
        model: User,
        attributes: ["id", "name", "email", "profileImage"],
      },
      {
        model: Like,
        attributes: ["userId"],
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
    user: blog.user,
    likes: blog.likes,
  });
};

const getBlogs = async (offset, limit) => {
  const blogs = await Blog.findAll({
    offset,
    limit,
    include: [
      {
        model: User,
        attributes: ["id", "name", "email", "profileImage"],
      },
      {
        model: Like,
        attributes: ["userId"],
      },
    ],
  });

  return blogs.map(
    (blog) =>
      new BlogResDto({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        coverImage: blog.coverImage,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        user: blog.user,
        likes: blog.likes,
      })
  );
};

const getUserBlogs = async (userId, offset, limit) => {
  const blogs = await Blog.findAll({
    where: { userId },
    offset,
    limit,
    include: [
      {
        model: User,
        attributes: ["id", "name", "email", "profileImage"],
      },
      {
        model: Like,
        attributes: ["userId"],
      },
    ],
  });

  return blogs.map(
    (blog) =>
      new BlogResDto({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        coverImage: blog.coverImage,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        user: blog.user,
        likes: blog.likes,
      })
  );
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
