import { AuthService } from "../services/auth.service.js";
import { BlogService } from "../services/blog.service.js";
import { CommentService } from "../services/comment.service.js";
import { UserService } from "../services/user.service.js";
import { mapper } from "./mapper.config.js";

export function dependencyConfig() {
  const dependencies = {
    /** The instance of the mapper class. */
    mapper: mapper,
    /** The instance of the service classes. */
    authService: new AuthService(dependencies),
    userService: new UserService(dependencies),
    blogService: new BlogService(dependencies),
    commentService: new CommentService(dependencies),
    /** The instance of the database repos. */
    userDB: null,
    blogDB: null,
    commentDB: null,
  };

  return new Promise((resolve, reject) => resolve(dependencies));
}
