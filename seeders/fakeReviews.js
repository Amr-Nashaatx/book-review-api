import { faker } from "@faker-js/faker";

export function createFakeReviews(reviewsCount) {
  const comments = [];
  for (let i = 0; i < reviewsCount; i++) {
    comments.push({
      comment: faker.lorem.paragraph(),
      rating: faker.number.int({ min: 1, max: 5 }),
    });
  }
  return comments;
}
