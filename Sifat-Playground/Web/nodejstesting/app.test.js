const request = require("supertest");
const { response } = require("./app");
const app = require("./app");

describe("Todos", () => {
  it("GET /todos array of todos", () => {
    return request(app)
      .get("/todos")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              completed: expect.any(Boolean),
            }),
          ])
        );
      });
  });

  it("GET /todos/:id specific todos", () => {
    return request(app)
      .get("/todos/1")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            completed: expect.any(Boolean),
          })
        );
      });
  });

  it("GET /todos 404 not found todos", () => {
    return request(app).get("/todos/88898").expect(404);
  });

  it("POST /todos create todo", () => {
    return request(app)
      .post("/todos")
      .send({
        name: "string",
        completed: "boolean",
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            name: "string",
            completed: "boolean",
          })
        );
      });
  });

  it("GET /todos validate request body", () => {
    return request(app).post("/todos").send({ name: 22 }).expect(422);
  });
});
