import { v2 as cloudinary } from "cloudinary";
import { environment } from "./environment.config.js";

cloudinary.config({
  cloud_name: environment.CLOUDINARY_NAME,
  api_key: environment.CLOUDINARY_KEY,
  api_secret: environment.CLOUDINARY_SECRET,
});

export { cloudinary };
