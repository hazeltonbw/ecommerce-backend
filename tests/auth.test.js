const request = require("supertest");
const app = require("../index");
const User = require("../models/user");

const mockData = require("./mockData");

describe("Auth route", () => {
  let response;
  let userId;
  const badBodyData = [
    { email: "testemail@email.com" }, // missing password key/value
    { password: "testpassword" }, // missing email key/value
    {}, // missing both email & password key/value
  ];

  const mockDataInstance = new mockData();
  const users = mockDataInstance.createMockUsers();
  const userObjectWithCart = {
    user_id: expect.any(Number),
    fname: expect.any(String),
    lname: expect.any(String),
    email: expect.any(String),
    password: expect.any(String),
    isadmin: expect.any(Boolean),
    cart_id: expect.any(Number),
    modified: expect.any(String),
    created: expect.any(String),
  };

  const userObject = {
    user_id: expect.any(Number),
    fname: expect.any(String),
    lname: expect.any(String),
    email: expect.any(String),
    password: expect.any(String),
    isadmin: expect.any(Boolean),
  };

  // afterEach(async () => {
  //   // after each test make sure our mock user doesn't exist.
  //   // this will ensure every test has a fresh start
  //   // and doesn't rely on stale data

  //   const userToDelete = await User.findUserByEmail(body.email);
  //   if (userToDelete) {
  //     await User.deleteUserById(userToDelete.user_id);
  //   }
  // });

  describe("POST /register", () => {
    // register our test user
    beforeAll(async () => {
      response = await request(app).post("/auth/register").send(users[0]);
    });

    describe("given a username and password in the body", () => {
      it("should return HTTP 200", async () => {
        expect(response.statusCode).toBe(302);
      });

      it.skip("should return user information in the response body", () => {
        expect(response.body).toEqual(userObjectWithCart);
      });
    });

    describe("when the user already exists", () => {
      beforeAll(async () => {
        // Create our user
        response = await request(app).post("/auth/register").send(users[0]);
        userId = response.body.user_id;
        // run again as to replicate "duplicating" user
        // store in response so we can test against it
        response = await request(app).post("/auth/register").send(users[0]);
      });
      afterAll(async () => {
        await request(app).delete(`/users/${userId}`);
      });

      it("should return HTTP 409 with error message in body", async () => {
        // throw createError(409, `User with email: ${email} already exists!`);
        expect(response.statusCode).toBe(409);
      });

      it("should return an object for the body", () => {
        expect(typeof response.body).toBe("object");
      });

      it("should return a property in the body named message", () => {
        expect(response.body).toHaveProperty(
          "message",
          `User with email: ${users[0].email} already exists!`
        );
      });
    });

    describe("when email or password info is missing", () => {
      it("should return HTTP 400 with error message", async () => {
        for (const body of badBodyData) {
          const response = await request(app).post("/auth/register").send(body);
          expect(response.statusCode).toBe(400);
          expect(typeof response.body).toBe("object");
          expect(response.body).toHaveProperty(
            "message",
            "Missing email or password information!"
          );
        }
      });
    });
  });

  describe("POST /login/password", () => {
    describe("when the username doesn't exist in the database", () => {
      // throw createError(401, "Incorrect username or password");
      let response;
      beforeAll(async () => {
        response = await request(app).post("/auth/login").send({
          email: "thisEmailDoesntExist@DoesntExist.com",
          password: "password",
        });
      });

      it("should return HTTP 401", async () => {
        expect(response.statusCode).toBe(401);
      });

      it("should have a property named message in the body", () => {
        expect(response.body).toHaveProperty(
          "message",
          "Incorrect username or password"
        );
      });
    });

    describe("when the password doesn't match in the database", () => {
      let response;
      beforeAll(async () => {
        // Create a user first
        response = await request(app).post("/auth/register").send(users[0]);
        userId = response.body.user_id;

        // Then send a bad password with the new users email
        response = await request(app).post("/auth/login").send({
          email: users[0].email,
          password: "thisPasswordDoesntWork",
        });
      });
      afterAll(async () => {
        await request(app).delete(`/users/${userId}`);
      });

      // afterAll(async () => {
      //   await request(app).delete(`/users/${userId}`);
      // });

      it("should return HTTP 401", () => {
        expect(response.statusCode).toBe(401);
      });

      it("should return an object for the body", () => {
        expect(typeof response.body).toBe("object");
      });

      it("should return a property in the body named message", () => {
        expect(response.body).toHaveProperty(
          "message",
          "Incorrect username or password"
        );
      });
    });

    describe("when the given credentials from the user match the database", () => {
      beforeAll(async () => {
        response = await request(app).post("/auth/register").send(users[0]);
        userId = response.body.user_id;
        response = await request(app)
          .post("/auth/login/password")
          .send(users[0]);
      });

      afterAll(async () => {
        await request(app).delete(`/users/${userId}`);
      });

      it.skip("should return HTTP 200", async () => {
        expect(response.statusCode).toBe(302);
      });

      it.skip("should return an object containing the user info", () => {
        expect(response.body).toEqual(userObject);
      });
    });

    describe("when there is no info sent at all", () => {
      let response;
      beforeAll(async () => {
        response = await request(app).post("/auth/register").send({});
      });

      it("should return HTTP 400", () => {
        expect(response.statusCode).toBe(400);
      });

      it("should return a property in the body named message", () => {
        expect(response.body).toHaveProperty(
          "message",
          "Missing email or password information!"
        );
      });
    });
  });

  describe("POST /logout", () => {
    let response;
    beforeAll(async () => {
      response = await request(app).post("/auth/logout");
    });

    it("should return HTTP 302", () => {
      // HTTP 302 - Moved
      expect(response.statusCode).toBe(200);
    });
  });
});
