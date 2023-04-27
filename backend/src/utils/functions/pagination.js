export const getPagination = ({ page, limit }) => {
  page = parseInt(page > 0 ? page : 1);
  limit = parseInt(limit > 0 ? limit : 12);
  const offset = (page - 1) * limit;
  return { offset, limit };
};
