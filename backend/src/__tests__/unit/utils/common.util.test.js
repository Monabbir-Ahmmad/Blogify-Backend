import { v2 as cloudinary } from "cloudinary";
import { commonUtil } from "../../../utils/common.util.js";

jest.mock("cloudinary");

describe("CommonUtil", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getPublicIdFromUrl", () => {
    const url = "http://example/image.jpg";
    const expectedPublicId = "example/image";

    it("should extract the public ID from a file URL", () => {
      const publicId = commonUtil.getPublicIdFromUrl(url);

      expect(publicId).toEqual(expectedPublicId);
    });
  });

  describe("deleteUploadedFile", () => {
    const url = "http://example/image.jpg";
    const publicId = "example/image";
    it("should delete an uploaded file and return true", async () => {
      cloudinary.uploader.destroy.mockResolvedValueOnce();
      commonUtil.getPublicIdFromUrl = jest.fn().mockReturnValueOnce(publicId);

      const result = await commonUtil.deleteUploadedFile(url);

      expect(result).toEqual(true);
    });

    it("should log error and return false if file deletion fails", async () => {
      cloudinary.uploader.destroy.mockRejectedValueOnce();
      commonUtil.getPublicIdFromUrl = jest.fn().mockReturnValueOnce(publicId);

      const result = await commonUtil.deleteUploadedFile(url);

      expect(result).toEqual(false);
    });
  });

  describe("calculateAge", () => {
    it("should calculate the age based on the given date of birth", () => {
      const dateString = "1990-01-01";
      const today = new Date();
      const birthDate = new Date(dateString);
      const expectedAge = today.getFullYear() - birthDate.getFullYear();

      const age = commonUtil.calculateAge(dateString);

      expect(age).toEqual(expectedAge);
    });
  });

  describe("getPagination", () => {
    it("should generate the offset and limit values based on the given page and limit", () => {
      const options = { page: 2, limit: 10 };
      const expectResult = { offset: 10, limit: 10 };

      const result = commonUtil.getPagination(options);

      expect(result).toEqual(expectResult);
    });

    it("should default to page 1 and limit 12 if invalid values are provided", () => {
      const options = { page: 0, limit: -5 };
      const expectResult = { offset: 0, limit: 12 };

      const result = commonUtil.getPagination(options);

      expect(result).toEqual(expectResult);
    });
  });

  describe("removeInvalidFields", () => {
    it("should remove invalid fields from the object", () => {
      const obj = { name: "John", age: 0, address: null };
      const ignoreProperties = ["address"];
      const expectedObj = { name: "John", address: null };

      commonUtil.removeInvalidFields(obj, ignoreProperties);

      expect(obj).toEqual(expectedObj);
    });
  });
});
