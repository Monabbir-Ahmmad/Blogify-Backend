import ejs from "ejs";
import { mailUtil } from "../../../utils/mail.util.js";

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(),
  }),
}));

jest.mock("ejs", () => ({
  renderFile: jest
    .fn()
    .mockResolvedValue("<html><body>Mocked Email Template</body></html>"),
}));

const mockedEmailAddress = "test@example.com";
const mockedEmailPassword = "testpassword";
jest.mock("../../../configs/environment.config.js", () => ({
  environment: {
    EMAIL_ADDRESS: mockedEmailAddress,
    EMAIL_PASSWORD: mockedEmailPassword,
  },
}));

jest.mock("path", () => ({
  resolve: jest.fn().mockReturnValue("mocked/template/path.ejs"),
}));

describe("MailUtil", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("sendEmail", () => {
    it("should send an email with the provided options", async () => {
      const options = {
        to: "recipient@example.com",
        subject: "Test Email",
        text: "This is a test email",
        html: "<html><body>This is a test email</body></html>",
      };

      await mailUtil.sendEmail(options);

      expect(mailUtil.transporter.sendMail).toHaveBeenCalledWith(options);
    });
  });

  describe("getResetPasswordMailTemplate", () => {
    it("should render the reset password email template with the provided data", async () => {
      // Arrange
      const appName = "MyApp";
      const username = "john.doe";
      const url = "https://example.com/reset-password";

      // Act
      const template = await mailUtil.getResetPasswordMailTemplate(
        appName,
        username,
        url
      );

      // Assert
      expect(ejs.renderFile).toHaveBeenCalledWith("mocked/template/path.ejs", {
        appName,
        username,
        url,
      });
      expect(template).toBe("<html><body>Mocked Email Template</body></html>");
    });

    it("should render the reset password email template with default URL if not provided", async () => {
      const appName = "MyApp";
      const username = "john.doe";

      const template = await mailUtil.getResetPasswordMailTemplate(
        appName,
        username
      );

      expect(ejs.renderFile).toHaveBeenCalledWith("mocked/template/path.ejs", {
        appName,
        username,
        url: "#",
      });
      expect(template).toBe("<html><body>Mocked Email Template</body></html>");
    });
  });
});
