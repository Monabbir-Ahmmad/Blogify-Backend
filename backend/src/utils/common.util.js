import fs from "fs/promises";
import path from "path";

const rootDir = process.cwd();

/**
 * @category Utilities
 * @classdesc A class that provides common utility functions.
 */
export class CommonUtil {
  /**
   * Deletes an uploaded file.
   * @param {string} fileName - The name of the file to delete.
   * @returns {Promise<boolean>} A promise that resolves to true if the deletion was successful, or false otherwise.
   */
  async deleteUploadedFile(fileName) {
    const fileFullPath = path.join(rootDir, "public", "uploads", fileName);

    try {
      await fs.unlink(fileFullPath);
      console.info(`${fileFullPath} was deleted`);
      return true;
    } catch (err) {
      console.error("Error while deleting file: ", err);
      return false;
    }
  }

  /**
   * Calculates the age based on a given date of birth.
   * @param {string} dateString - The date of birth in string format.
   * @returns {number} The calculated age.
   */
  calculateAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    const m = today.getMonth() - birthDate.getMonth();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * Generates pagination offsets based on page and limit values.
   * @param {Object} options - The pagination options.
   * @param {number} options.page - The current page number.
   * @param {number} options.limit - The maximum number of items per page.
   * @returns {Object} An object containing the offset and limit values.
   */
  getPagination({ page, limit }) {
    page = parseInt(page > 0 ? page : 1);
    limit = parseInt(limit > 0 ? limit : 12);
    const offset = (page - 1) * limit;
    return { offset, limit };
  }

  /**
   * Removes invalid fields from an object.
   * @param {Object} obj - The object to remove invalid fields from.
   * @param {string[]} [ignoreProperties=[]] - An array of properties to ignore during the removal process.
   */
  removeInvalidFields(obj, ignoreProperties = []) {
    Object.keys(obj).forEach((key) => {
      if (
        !obj[key] &&
        !ignoreProperties.includes(key) &&
        Object.getOwnPropertyDescriptor(obj, key).configurable
      )
        delete obj[key];
    });
  }
}

export const commonUtil = new CommonUtil();
