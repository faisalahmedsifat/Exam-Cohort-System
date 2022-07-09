const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

beforeAll(() => {
    //
})

describe("this is a test suit -->", () => {
  test("Testing at route / -> ", async () => {
    await api.get("/").expect(200);
  });
  test("Testing at route /api/notes", async() => {
    await api.get("/api/notes").expect('content-type', /application\/json/)
  })
});
