import bcryptjs from "bcryptjs";

export const hashPassword = async (password) => {
  try {
    const salt = await bcryptjs.genSalt(process.env.PASSWORD_SALT_ROUNDS);
    return await bcryptjs.hash(password, salt);
  } catch (error) {
    console.error(error);
    throw new Error("No password found for hashing!");
  }
};

export const verifyPassword = async (enteredPassword, hashedPassword) => {
  try {
    return await bcryptjs.compare(enteredPassword, hashedPassword);
  } catch (error) {
    console.error(error);
    throw new Error("Password varification failed!");
  }
};
