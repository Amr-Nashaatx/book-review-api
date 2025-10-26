import { describe, test, expect, beforeEach, vi } from "vitest";
import { registerUser, loginUser } from "../../../src/services/authService.js";
import { AppError } from "../../../src/utils/errors/AppError.js";
// mocked deps
import { UserModel } from "../../../src/models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Mock modules
vi.mock("../../../src/models/userModel.js");
vi.mock("bcrypt");
vi.mock("jsonwebtoken");

describe("Auth Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("registerUser should create user and return token", async () => {
    UserModel.findOne.mockResolvedValue(null);
    UserModel.create.mockResolvedValue({
      _id: "123",
      name: "Amr",
      email: "amr@test.com",
      role: "user",
    });
    jwt.sign.mockReturnValue("fake.jwt.token");

    const { user, token } = await registerUser(
      "Amr",
      "amr@test.com",
      "pass1234"
    );

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: "amr@test.com" });
    expect(UserModel.create).toHaveBeenCalled();
    expect(token).toBe("fake.jwt.token");
    expect(user).toEqual({
      id: "123",
      name: "Amr",
      email: "amr@test.com",
      role: "user",
    });
  });

  test("registerUser should throw if email already exists", async () => {
    UserModel.findOne.mockResolvedValue({ email: "amr@test.com" });

    await expect(
      registerUser("Amr", "amr@test.com", "pass1234")
    ).rejects.toThrow(AppError);

    expect(UserModel.create).not.toHaveBeenCalled();
  });

  test("loginUser should authenticate valid user", async () => {
    const mockUser = {
      _id: "456",
      name: "Amr",
      email: "amr@test.com",
      password: "hashedpass",
      role: "user",
    };

    UserModel.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake.jwt.token");

    const { user, token } = await loginUser("amr@test.com", "pass1234");

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: "amr@test.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith("pass1234", "hashedpass");
    expect(token).toBe("fake.jwt.token");
    expect(user.email).toBe("amr@test.com");
  });

  test("loginUser should throw if email is invalid", async () => {
    UserModel.findOne.mockResolvedValue(null);

    await expect(loginUser("unknown@test.com", "pass1234")).rejects.toThrow(
      AppError
    );
  });

  test("loginUser should throw if password is invalid", async () => {
    const mockUser = {
      _id: "789",
      name: "Amr",
      email: "amr@test.com",
      password: "hashedpass",
      role: "user",
    };

    UserModel.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await expect(loginUser("amr@test.com", "wrongpass")).rejects.toThrow(
      AppError
    );
  });
});
