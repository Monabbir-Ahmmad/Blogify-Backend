import bcryptjs from "bcryptjs";

export const hashPassword = async (password) => {
  try {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
  } catch (error) {
    console.log(error);
    throw new Error("No password found for hashing!");
  }
};

export const verifyPassword = async (hashedPassword, enteredPassword) => {
  try {
    return await bcryptjs.compare(enteredPassword, hashedPassword);
  } catch (error) {
    console.log(error);
    throw new Error("Password varification failed!");
  }
};
