/* eslint-disable no-undef */
const login = require("./login-test");

describe("Test", () => {
  test("Has a status of 200", async () => {
    const response = await login("qasya@gmail.com", "qasya@gmail.com");
    expect(response.status).toBe(200);
  });
  test("Is the token received", async () => {
    const response = await login("qasya@gmail.com", "qasya@gmail.com");

    expect(!!response.data.token).toBe(true);
  });
  test("Does it include email and subscription", async () => {
    const response = await login("qasya@gmail.com", "qasya@gmail.com");
    const { email, subscription } = response.data.user;
    expect(typeof email).toBe("string");
    expect(typeof subscription).toBe("string");
  });
});
