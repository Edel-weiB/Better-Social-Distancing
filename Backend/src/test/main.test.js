const assert = require("assert");
const express = require("express");
const chai = require("chai");
const request = require("supertest");

const app = express();
describe("GET Request on /map/add", () => {
    it("should GET response done to the user", () => {
        request(app).post("/map/add?x=111&y=222").send().expect(201);
    });
});
