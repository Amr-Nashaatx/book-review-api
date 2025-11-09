import Redis from "ioredis";

const redis = new Redis({
  host: "redis",
  port: 6379,
});

export async function getCachedPageCount(Model, limit = 10) {
  const cacheKey = `${Model.collection.name}:pageCount:${limit}`;
  const ttl = 1800; // 30 minutes

  let cached = await redis.get(cacheKey);
  if (cached) {
    return Number(cached);
  }
  // Not in cache → compute from DB
  const totalDocs = await Model.countDocuments();
  const pageCount = Math.ceil(totalDocs / limit);

  // Store in cache
  await redis.set(cacheKey, pageCount, "EX", ttl);

  return pageCount;
}

export const fetchPaginatedData = async (
  Model,
  { filters = {}, after = null, before = null, limit = 10, sort = "-_id" }
) => {
  const [field, direction] = sort.startsWith("-")
    ? [sort.substring(1), -1]
    : [sort, 1];

  const isBackward = !!before && !after;
  const isForward = !!after || (!after && !before); // treat "no cursors" as forward (first page)

  if (isForward && after)
    filters[field] = direction === 1 ? { $gt: after } : { $lt: after };

  if (isBackward)
    filters[field] = direction === 1 ? { $lt: before } : { $gt: before };

  const dbSort = isBackward ? -direction : direction; // allign sort and filter range for efficient index scan.

  let queryResult = await Model.find(filters)
    .sort({ [field]: dbSort })
    .limit(Number(limit) + 1);

  const hasMore = queryResult.length > limit;
  if (hasMore) queryResult.pop();

  // If we fetched in reverse for backward, flip back to user-visible order
  queryResult = isBackward ? queryResult.revers() : queryResult;

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
  const pageCount = await getCachedPageCount(Model, limit);
  return {
    [Model.collection.name]: queryResult,
    pageInfo: {
      hasNextPage, // forward pagination or first page
      hasPrevPage, // anything after first page
      nextCursor: lastItem ? lastItem[field] : null,
      prevCursor: firstItem ? firstItem[field] : null,
      pageCount,
    },
  };
};
