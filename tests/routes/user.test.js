import { api } from "../setup.js";
import { expect, describe, test } from "vitest";

describe("User Routes", () => {
  describe("/me route", () => {
    test("Fetch current user from cookie", async () => {
      const registerRes = await api.post("/api/auth/register").send({
        name: "Amr",
        email: "amr@test.com",
        password: "pass1234",
      });

      const cookie = registerRes.headers["set-cookie"];

      const res = await api.get("/api/user/me").set("Cookie", cookie);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe("amr@test.com");
    });
  });
});
