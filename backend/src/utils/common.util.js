import { cloudinary } from "../configs/cloudinary.config.js";
import { JSDOM } from "jsdom";

/**
 * @category Utilities
 * @classdesc A class that provides common utility functions.
 */
export class CommonUtil {
  /**
   * Gets the public ID from a given file url.
   * @param {string} url - The file path.
   * @returns {string} The public ID.
   */
  getPublicIdFromUrl(url) {
    const [folder, id] = url.split("/").slice(-2);
    const publicId = folder + "/" + id.split(".")[0];
    return publicId;
  }

  /**
   * Deletes an uploaded file.
   * @param {string} url - The name of the file to delete.
   * @returns {Promise<boolean>} A promise that resolves to true if the deletion was successful, or false otherwise.
   */
  async deleteUploadedFile(url) {
    const publicId = this.getPublicIdFromUrl(url);
    try {
      await cloudinary.uploader.destroy(publicId);
      console.info(`${url} was deleted`);
      return true;
    } catch (error) {
      console.error("Error while deleting file: ", error);
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

  /**
   * Extracts text from HTML.
   * @param {string} html - The HTML to extract text from.
   * @returns {string} The extracted text.
   */
  extractTextFromHtml(html) {
    const { document } = new JSDOM("").window;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    return tempDiv.textContent;
  }
}

export const commonUtil = new CommonUtil();
