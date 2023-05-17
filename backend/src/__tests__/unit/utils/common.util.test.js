import { commonUtil } from "../../../utils/common.util";
import fs from "fs/promises";
import path from "path";

jest.mock("fs/promises", () => ({
  unlink: jest.fn().mockResolvedValue(),
}));

jest.spyOn(console, "info").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

describe("CommonUtil", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("deleteUploadedFile", () => {
    it("should delete the uploaded file and return true if deletion is successful", async () => {
      const fileName = "example.jpg";
      const fileFullPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        fileName
      );

      await commonUtil.deleteUploadedFile(fileName);

      expect(fs.unlink).toHaveBeenCalledWith(fileFullPath);
      expect(console.info).toHaveBeenCalledWith(`${fileFullPath} was deleted`);
      expect(console.error).not.toHaveBeenCalled();
    });

    it("should return false if an error occurs during file deletion", async () => {
      const fileName = "example.jpg";
      const fileFullPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        fileName
      );
      const error = new Error("Failed to delete file");
      fs.unlink.mockRejectedValueOnce(error);

      const result = await commonUtil.deleteUploadedFile(fileName);

      expect(fs.unlink).toHaveBeenCalledWith(fileFullPath);
      expect(console.error).toHaveBeenCalledWith(
        "Error while deleting file: ",
        error
      );
      expect(result).toBe(false);
    });
  });

  describe("calculateAge", () => {
    it("should calculate the age based on a given date of birth", () => {
      const dateString = "1990-01-01";

      const age = commonUtil.calculateAge(dateString);

      expect(age).toBeGreaterThan(0);
      expect(typeof age).toBe("number");
    });
  });

  describe("getPagination", () => {
    it("should generate the pagination offsets based on page and limit values", () => {
      const options = { page: 2, limit: 10 };

      const pagination = commonUtil.getPagination(options);

      expect(pagination.offset).toBe(10);
      expect(pagination.limit).toBe(10);
    });

    it("should use default values if page or limit is not provided", () => {
      const options = {};

      const pagination = commonUtil.getPagination(options);

      expect(pagination.offset).toBe(0);
      expect(pagination.limit).toBe(12);
    });
  });

  describe("removeInvalidFields", () => {
    it("should remove invalid fields from an object", () => {
      const obj = {
        name: "John Doe",
        age: 25,
        email: null,
        address: undefined,
        phone: "",
      };
      const ignoreProperties = ["email"];

      commonUtil.removeInvalidFields(obj, ignoreProperties);

      expect(obj).toEqual({ name: "John Doe", email: null, age: 25 });
    });
  });
});
