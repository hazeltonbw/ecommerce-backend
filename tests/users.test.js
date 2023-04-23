const request = require("supertest");
const app = require("../index");
// create our mockData

const mockData = require("./mockData");
let mockDataInstance = new mockData();

// beforeAll(async () => {
//   await seedDatabase();
// });

// afterAll(async () => {
//   await clearDatabase();
// })

describe("Users route", () => {
  let response;
  // create test users
  const users = mockDataInstance.createMockUsers();
  // change later after registering our test user
  let userId;
  beforeAll(async () => {
    // register one of the users
    response = await request(app).post("/auth/register").send(users[0]);
    userId = response.body.userId;
  });

  afterAll(async () => {
    // delete test user after done
    response = await request(app).delete(`/users/${userId}`);
  });
  const userObject = expect.objectContaining({
    user_id: expect.any(Number),
    fname: expect.any(String),
    lname: expect.any(String),
    email: expect.any(String),
    isadmin: expect.any(Boolean),
  });
  const messageObject = expect.objectContaining({
    message: expect.any(String),
  });

  describe("GET /users", () => {
    beforeAll(async () => {
      response = await request(app).get("/users");
      userId = response.body[0].user_id;
    });
    it("should return HTTP 200", () => {
      expect(response.statusCode).toBe(200);
    });

    it("should list all users in json", async () => {
      expect(response.body).toEqual(expect.arrayContaining([userObject]));
    });
  });

  describe("GET /users/:id", () => {
    describe("given a registered users id", () => {
      beforeAll(async () => {
        const url = `/users/${userId}`;
        response = await request(app).get(url);
      });

      it("should return HTTP 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should return a user object", () => {
        expect(response.body).toEqual(userObject);
      });
    });

    describe("given an id that doesnt exist", () => {
      beforeAll(async () => {
        response = await request(app).get("/users/99999999");
      });
      it("should return HTTP 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should not return a user object", () => {
        expect(response.body).not.toEqual(userObject);
      });
    });
  });

  describe("PUT /users/:id", () => {
    let newPassword = "thisIsANewPassword";
    beforeAll(async () => {
      response = await request(app).put(`/users/${userId}`).send({
        password: newPassword,
      });
    });

    describe("given a valid user id", () => {
      it("should return HTTP 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should return a user object", () => {
        expect(response.body).toEqual(userObject);
      });
    });

    describe("given an invalid id", () => {
      beforeAll(async () => {
        response = await request(app).put("/users/9999999").send({
          password: newPassword,
        });
      });

      it("should return HTTP 400", () => {
        expect(response.statusCode).toBe(400);
      });

      it("should return an object with property message", () => {
        expect(response.body).toEqual(messageObject);
      });
    });
  });

  describe("DELETE /users/:id", () => {
    beforeAll(async () => {
      response = await request(app).delete(`/users/${userId}`);
    });
    describe("given a valid user id", () => {
      it("should return HTTP 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should return an object with message property", () => {
        expect(response.body).toEqual(messageObject);
      });
    });

    describe("given an invalid user id", () => {
      beforeAll(async () => {
        response = await request(app).delete("/users/999999");
      });
      it("should return HTTP 404", () => {
        expect(response.statusCode).toBe(404);
      });

      it("should return an object with message property", () => {
        expect(response.body).toEqual(messageObject);
      });
    });
  });
});
