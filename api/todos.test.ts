import request from "supertest";
import http from "http";
import app from "./index";

describe("Test the truthiness of true", () => {
  test("It should be truthy", () => {
    expect(true).toBeTruthy();
  });
});
