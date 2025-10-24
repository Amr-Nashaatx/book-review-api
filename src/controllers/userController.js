import { asyncHandler } from "../middlewares/asyncHandler.js";

export const me = asyncHandler(async (req, res, next) => {
  res.json({
    data: {
      user: req.user,
    },
  });
});
