const request = require("supertest");
const app = require("../index");
const mockData = require("./mockData");
const mockDataInstance = new mockData();
const { seedDatabase, clearDatabase } = require("../db/seedDatabase");

describe("Products route", () => {
  // variable setup needed to test product route
  let response;
  let productId = 1;
  const products = mockDataInstance.createMockProducts();
  const productObject = expect.objectContaining({
    product_id: expect.any(Number),
    category_id: expect.any(Number),
    title: expect.any(String),
    price: expect.any(String),
    description: expect.any(String),
  });
  let arrayOfProducts = expect.arrayContaining([productObject]);
  const emptyObject = expect.objectContaining({});
  const emptyArray = expect.arrayContaining([]);
  const badUrls = [
    "/products?category=wgwergrwgrgreg",
    "/products?name=rgkjergiergreger",
    "/products?name=3230222g2",
    "/products?name=_________123",
  ];

  describe("GET /products", () => {
    beforeAll(async () => {
      response = await request(app).get("/products");
      productId = response.body[0].product_id;
    });

    it("should return HTTP 200", async () => {
      expect(response.statusCode).toBe(200);
    });

    it("should return an array of products", () => {
      expect(response.body).toEqual(arrayOfProducts);
    });
  });

  describe("GET /products?query=something", () => {
    // two queries could be possible, name and category
    // see urls object above to see possible queries
    describe("given a query that matches something in the database", () => {
      it("should ", async () => {
        for (const product of products) {
          // Test category first
          const categoryId = product.category_id;
          let url = `/products?category=${categoryId}`;

          response = await request(app).get(url);
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual(arrayOfProducts);
          // Test title next
          url = `/products?query=${product.title}`;
          response = await request(app).get(url);
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual(arrayOfProducts);
        }
      });
    });

    describe("given a query that doesnt match something in the database", () => {
      it("should ", async () => {
        for (const url of badUrls) {
          response = await request(app).get(url);
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual(emptyArray);
        }
      });
    });
  });

  describe("GET /products/:id", () => {
    describe("given a valid id", () => {
      beforeAll(async () => {
        response = await request(app).get(`/products/${productId}`);
      });

      it("should return HTTP 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should return a single product object", () => {
        expect(response.body).toEqual(productObject);
      });
    });

    describe("given an invalid id", () => {
      beforeAll(async () => {
        response = await request(app).get(`/products/1999999999`);
      });

      it("should return HTTP 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should return an empty object", () => {
        expect(response.body).toEqual(emptyObject);
      });
    });
  });

  describe("PUT /products/:id", () => {
    describe("given a bad id", () => {
      beforeAll(async () => {
        response = await request(app).put(`/products/1999999999`).send({
          name: "Great product name",
          price: 350.0,
          description: "What a great description",
          category: "Fishing",
        });
      });

      it("should return HTTP 400", () => {
        expect(response.statusCode).toBe(400);
      });

      it("should return an object with message property", () => {
        expect(response.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
          })
        );
      });
    });

    describe("given a valid id", () => {
      beforeAll(async () => {
        response = await request(app).put(`/products/${productId}`).send({
          name: "Great product name",
          price: 350.0,
          description: "What a great description",
        });
      });

      it("should return HTTP 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should return the updated products object", () => {
        expect(response.body).toEqual(productObject);
      });
    });
  });

  describe("DELETE /products/:id", () => {
    describe("given a bad id", () => {
      beforeAll(async () => {
        response = await request(app).delete(`/products/1999999999`);
      });

      it("should return HTTP 400", () => {
        expect(response.statusCode).toBe(400);
      });

      it("should return an object with message property", () => {
        expect(response.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
          })
        );
      });
    });

    describe("given a valid id", () => {
      beforeAll(async () => {
        response = await request(app).delete(`/products/${productId}`);
      });

      it("should return HTTP 204", () => {
        expect(response.statusCode).toBe(204);
      });

      it("should return nothing in the body", () => {
        expect(response.body).toEqual(emptyObject);
      });
    });
  });
});
