import fs from "fs/promises";
import path from "path";

const rootDir = process.cwd();

/**
 * @param {string} fileName
 * @returns {Promise<boolean>}
 * @description Deletes file from uploads folder
 */
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

/**
 * @param {string} dateString
 * @returns {number}
 * @description Calculates age from date string
 */
const calculateAge = (dateString) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  const m = today.getMonth() - birthDate.getMonth();
  let age = today.getFullYear() - birthDate.getFullYear();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * @param {Object} pagination
 * @param {number} pagination.page
 * @param {number} pagination.limit
 * @returns {{offset: number, limit: number}}}
 * @description Calculates offset and limit for pagination
 */
const getPagination = ({ page, limit }) => {
  page = parseInt(page > 0 ? page : 1);
  limit = parseInt(limit > 0 ? limit : 12);
  const offset = (page - 1) * limit;
  return { offset, limit };
};

/**
 * @param {Object} obj
 * @description Removes invalid fields from object
 */
const removeInvalidFields = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (!obj[key] && Object.getOwnPropertyDescriptor(obj, key).configurable)
      delete obj[key];
  });
};

export const commonUtil = {
  deleteUploadedFile,
  calculateAge,
  getPagination,
  removeInvalidFields,
};
