import { asyncHandler } from "../middlewares/asyncHandler.js";
import { Response, NextFunction } from "express";

export const me = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    res.json({
      data: {
        user: req.user,
      },
    });
  },
);
