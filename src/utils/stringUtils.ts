// this complex looking function all it does is just capture the pattern --> example[..]
const parseRangeQuery = (
  s: string,
): { queryParam: string; value: string | null } => {
  const rangeFilterRegex = /(\w+)(?:\s*\[([^\]]+)\])?/g;
  const matchedStrings = Array.from(s.matchAll(rangeFilterRegex))[0];
  return { queryParam: matchedStrings[1], value: matchedStrings[2] || null };
};

// simple utility searches the expectedFields array by queryParam and returns it if found ---> {queryParam: "", fieldName: ""}
const getExpectedFieldByParam = (
  expectedFields: any[],
  queryParam: string,
): any => {
  for (let expectedField of expectedFields) {
    if (expectedField.queryParam === queryParam) return expectedField;
  }
  return null;
};

// expectedFields have this structure ---> [{queryParam: "", fieldName: ""}]
export const buildRangeQueriesFromString = (
  query: any,
  expectedFields: any[],
  filter: any,
): void => {
  for (let key in query) {
    const { queryParam, value } = parseRangeQuery(key);
    const field = getExpectedFieldByParam(expectedFields, queryParam);
    if (field) {
      const res: any = {};
      if (value === "gte") res.$gte = Number(query[key]);
      if (value === "lte") res.$lte = Number(query[key]);
      if (Object.keys(res).length) filter[field.fieldName] = res;
    }
  }
};
