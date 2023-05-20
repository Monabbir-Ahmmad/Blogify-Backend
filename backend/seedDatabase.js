import { UserType } from "./src/models/userType.model.js";

const initialUserTypes = ["Administrator", "Normal"];

const seedDatabase = async () => {
  try {
    await UserType.bulkCreate(
      initialUserTypes.map((userType) => ({ name: userType })),
      { ignoreDuplicates: true }
    );

    console.log("Database seeded...");
  } catch (error) {
    console.error(error);
  }
};

export default seedDatabase;
