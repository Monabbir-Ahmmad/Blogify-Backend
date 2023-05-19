import { connectToDatabase, database } from "../configs/database.config.js";

import seedDatabase from "../../seedDatabase.js";

const databaseSetup = async () => {
  await connectToDatabase();
  await database.sync({ force: true });
  await seedDatabase();
  return await database.close();
};

export default databaseSetup;
