import { describe, test, expect, beforeEach, vi } from "vitest";

// mocked deps

vi.mock("bcrypt");
vi.mock("jsonwebtoken");

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

let registerUser, loginUser, UserModel;
describe("Auth Service", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.doMock("../../src/models/userModel.js", () => ({
      UserModel: {
        create: vi.fn(),
        findOne: vi.fn(),
      },
    }));

    const { UserModel: MockedUserModel } = await import(
      "../../src/models/userModel.js"
    );
    const serviceModule = await import("../../src/services/authService.js");

    registerUser = serviceModule.registerUser;
    loginUser = serviceModule.loginUser;
    UserModel = MockedUserModel;
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
    ).rejects.toThrow(
      expect.objectContaining({
        status: "fail",
        message: "Email already exists",
        statusCode: 400,
      })
    );

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

    UserModel.findOne.mockReturnValue({
      select: vi.fn().mockResolvedValue(mockUser),
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake.jwt.token");

    const { user, token } = await loginUser("amr@test.com", "pass1234");

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: "amr@test.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith("pass1234", "hashedpass");
    expect(token).toBe("fake.jwt.token");
    expect(user.email).toBe("amr@test.com");
  });

  test("loginUser should throw if email is invalid", async () => {
    UserModel.findOne.mockReturnValue({
      select: vi.fn().mockResolvedValue(null),
    });

    await expect(loginUser("unknown@test.com", "pass1234")).rejects.toThrow(
      expect.objectContaining({
        status: "fail",
        message: "Email or password is wrong",
      })
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

    UserModel.findOne.mockReturnValue({
      select: vi.fn().mockResolvedValue(mockUser),
    });
    bcrypt.compare.mockResolvedValue(false);

    await expect(loginUser("amr@test.com", "wrongpass")).rejects.toThrow(
      expect.objectContaining({
        status: "fail",
        message: "Email or password is wrong",
        statusCode: 400,
      })
    );
  });
});
