import { api } from "../setup.js";
import { expect, describe, test } from "vitest";

describe("Auth routes", () => {
  describe("/register route", () => {
    test("Register new user", async () => {
      const res = await api.post("/api/auth/register").send({
        name: "Amr",
        email: "amr@test.com",
        password: "pass1234",
      });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.user).toHaveProperty("email", "amr@test.com");
      expect(res.headers["set-cookie"]).toBeDefined(); // cookie should be sent
    });

    test("Prevent duplicate registration", async () => {
      await api.post("/api/auth/register").send({
        name: "Amr",
        email: "amr@test.com",
        password: "pass1234",
      });
      const res = await api.post("/api/auth/register").send({
        name: "Amr2",
        email: "amr@test.com",
        password: "pass5678",
      });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.message).toBe("Email already exists");
    });
  });

  describe("/login route", () => {
    test("Login with valid credentials", async () => {
      await api.post("/api/auth/register").send({
        name: "Amr",
        email: "amr@test.com",
        password: "pass1234",
      });

      const res = await api.post("/api/auth/login").send({
        email: "amr@test.com",
        password: "pass1234",
      });

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe("amr@test.com");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    test("Reject login with wrong password", async () => {
      await api.post("/api/auth/register").send({
        name: "Amr",
        email: "amr@test.com",
        password: "pass1234",
      });

      const res = await api.post("/api/auth/login").send({
        email: "amr@test.com",
        password: "wrongpass",
      });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    test("Reject login with wrong email", async () => {
      await api.post("/api/auth/register").send({
        name: "Amr",
        email: "amr@test.com",
        password: "pass1234",
      });

      const res = await api.post("/api/auth/login").send({
        email: "amr@test2.com",
        password: "pass1234",
      });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });
  });
});
