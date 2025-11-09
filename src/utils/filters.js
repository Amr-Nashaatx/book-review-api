import { buildRangeQueriesFromString } from "./stringUtils";

export const buildBookFilters = (query) => {
  const filter = {};
  const expectedFields = [
    { queryParam: "rating", fieldName: "averageRating" },
    { queryParam: "publishedYear", fieldName: "publishedYear" },
  ];
  buildRangeQueriesFromString(query, expectedFields, filter);
  if (query.genre) {
    filter.genre = { $in: query.genre.split(",") };
  }
  if (query.createdBy) {
    filter.createdBy = query.createdBy;
  }

  if (query.q) {
    filter.$text = { $search: query.q };
  }

  return filter;
};
