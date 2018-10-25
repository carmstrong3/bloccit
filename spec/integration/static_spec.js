const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";


describe("routes : static", () => {
   describe("GET /", () => {
     it("should return status code 200 and have 'Welcome to Bloccit' in the body of the response", () => {  
       request.get(base, (err, res, body) => {
         expect(res.statusCode).toBe(200);
         expect(body).toContain("Welcome to Bloccit");
       });
     });
   });
   describe("GET /marco", () => {
     it("should return a status code 200 and body string of 'polo'", (done) => {
       request.get(base + "marco", (err, res, body) => {
         expect(res.statusCode).toBe(200);
         expect(body).toBe("polo");
         done();
       });
     });
   });
});

