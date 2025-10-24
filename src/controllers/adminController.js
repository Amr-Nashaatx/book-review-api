export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});
