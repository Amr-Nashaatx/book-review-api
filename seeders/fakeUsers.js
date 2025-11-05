import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

dotenv.config();

export function createFakeUsers(usersCount) {
  const users = [];
  for (let i = 0; i < usersCount; i++) {
    const name = faker.person.fullName();
    users.push({
      _id: faker.database.mongodbObjectId(),
      name,
      email: faker.internet.email({ firstName: name }),
      password: faker.internet.password(),
    });
  }
  return users;
}
