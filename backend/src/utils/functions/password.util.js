/**@param {string} password */
const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(parseInt(environment.SALT_ROUNDS));
  return await bcryptjs.hash(password, salt);
};

/**
 * @param {string} inputPassword
 * @param {string} hashedPassword
 */
const verifyPassword = async (inputPassword, hashedPassword) => {
  return await bcryptjs.compare(inputPassword, hashedPassword);
};

export const passwordUtil = {
  hashPassword,
  verifyPassword,
};
