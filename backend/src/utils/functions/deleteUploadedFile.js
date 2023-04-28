import fs from "fs/promises";
import path from "path";

const rootDir = process.cwd();

const deleteUploadedFile = async (fileName) => {
  const fileFullPath = path.join(rootDir, "public", "uploads", fileName);

  try {
    await fs.unlink(fileFullPath);
    console.info(`${fileFullPath} was deleted`);
    return true;
  } catch (err) {
    console.error("Error while deleting file: ", err);
    return false;
  }
};

export default deleteUploadedFile;
