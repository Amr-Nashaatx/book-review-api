// this complex looking function all it does is just capture the pattern --> example[..]
const parseRangeQuery = (s) => {
  const rangeFilterRegex = /(\w+)(?:\s*\[([^\]]+)\])?/g;
  const matchedStrings = Array.from(s.matchAll(rangeFilterRegex))[0];
  return { queryParam: matchedStrings[1], value: matchedStrings[2] || null };
};

// simple utility searches the expectedFields array by queryParam and returns it if found ---> {queryParam: "", fieldName: ""}
const getExpectedFieldByParam = (expectedFields, queryParam) => {
  for (let expectedField of expectedFields) {
    if (expectedField.queryParam === queryParam) return expectedField;
  }
  return null;
};
// expectedFields have this structure ---> [{queryParam: "", fieldName: ""}]
export const buildRangeQueriesFromString = (query, expectedFields, filter) => {
  for (let key in query) {
    const { queryParam, value } = parseRangeQuery(key);
    const field = getExpectedFieldByParam(expectedFields, queryParam);
    if (field) {
      const res = {};
      if (value === "gte") res.$gte = Number(query[key]);
      if (value === "lte") res.$lte = Number(query[key]);
      if (Object.keys(res).length) filter[field.fieldName] = res;
    }
  }
};
