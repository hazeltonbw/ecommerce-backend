const supertest = require("supertest");
const pool = require("../db/index");
const app = require("../index");
const mockData = require("./mockData");

describe("testing postgres", () => {
  //   beforeAll(async () => {
  //     pgPool = await pool.getClient();

  //     console.log(pgPool);
  //   });

  //   afterAll(async () => {
  //     pgPool.release();
  //   });

  it("should test", async () => {
    const mockDataInstance = new mockData();
    const users = mockDataInstance.createMockUsers();
    //const client = await pool.getClient();
    try {
      await pool.query("BEGIN");

      //const { rows } = await client.query('SELECT 1 AS "result"');
      const response = await supertest(app)
        .post("/auth/register")
        .send(users[0]);
      expect(response.status).toBe(200);
    } catch (err) {
      throw err;
    } finally {
      await pool.query("ROLLBACK");
      //client.release();
    }
  });
});
