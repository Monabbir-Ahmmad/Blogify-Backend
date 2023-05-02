import { UserType } from "./src/models/userType.model.js";

const initialUserTypes = ["Administrator", "Normal"];

const seedDatabase = async () => {
  for (let i = 0; i < initialUserTypes.length; i++) {
    try {
      await UserType.findOrCreate({
        where: {
          name: initialUserTypes[i],
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  console.log("Database seeded...");
};

export default seedDatabase;
