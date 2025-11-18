export const fetchPaginatedData = async (
  Model,
  { filters = {}, after = null, before = null, limit = 10, sort = "-_id" },
  queryOptions = {}
) => {
  const [field, direction] = sort.startsWith("-")
    ? [sort.substring(1), -1]
    : [sort, 1];

  const isAfterExists = !!after;
  const isBeforeExists = !!before;
  const isNoCursorSet = !after && !before;

  const isBackward = isBeforeExists && !isAfterExists;
  const isForward = isAfterExists || isNoCursorSet; // treat "no cursors" as forward (first page)

  if (isForward && isAfterExists)
    filters[field] = direction === 1 ? { $gt: after } : { $lt: after };

  if (isBackward)
    filters[field] = direction === 1 ? { $lt: before } : { $gt: before };

  const dbSort = isBackward ? -direction : direction; // allign sort and filter range for efficient index scan.

  if (queryOptions.findCriteria) {
    filters[queryOptions.findCriteria.fieldName] =
      queryOptions.findCriteria.value;
  }
  let query = Model.find(filters);

  if (queryOptions.populate) {
    query = query.populate(queryOptions.populate[0], queryOptions.populate[1]);
  }

  let queryResult = await query
    .sort({ [field]: dbSort })
    .limit(Number(limit) + 1)
    .exec();

  const hasMore = queryResult.length > limit;
  if (hasMore) queryResult.pop();

  // If we fetched in reverse for backward, flip back to user-visible order
  queryResult = isBackward ? queryResult.reverse() : queryResult;

  let hasNextPage = false,
    hasPrevPage = false;

  if (isBackward) {
    hasPrevPage = hasMore; // more older items beyond the window
    hasNextPage = true; // since you moved back, you’re not at the end
  } else {
    hasNextPage = hasMore; // more newer items ahead
    hasPrevPage = !!after; // if you came from a previous page
  }

  const firstItem = queryResult[0];
  const lastItem = queryResult[queryResult.length - 1];
  return {
    [Model.collection.name]: queryResult,
    pageInfo: {
      hasNextPage, // forward pagination or first page
      hasPrevPage, // anything after first page
      nextCursor: lastItem ? lastItem[field] : null,
      prevCursor: firstItem ? firstItem[field] : null,
    },
  };
};
