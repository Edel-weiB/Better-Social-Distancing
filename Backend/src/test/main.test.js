const assert = require("assert");
const express = require("express");
const chai = require("chai");
const request = require("supertest");
const should = chai.should();
const app = require("../engine");

// User Testing All endpoints
describe("GET Request on /map/add", () => {
    it("should GET response done to the user", (done) => {
        request(app)
            .post("/map/add?x=111&y=222")
            .end((err, res) => {
                res.status.should.be.eql(201);
                res.body.should.have.property("message");
                res.body.should.have.property("message").eql("Done");
                done();
            });
    });
});

describe("GET Request on /users/checkout", () => {
    it("should GET message Checkout Complete", (done) => {
        request(app)
            .get("/users/checkout")
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.have.property("message");
                res.body.should.have
                    .property("message")
                    .eql("Checkout Complete");
                done();
            });
    });
});

describe("GET Request on /users/checkin", () => {
    it("should GET message Checkin Complete", (done) => {
        request(app)
            .get("/users/checkin")
            .end((err, res) => {
                res.status.should.be.eql(200);
                res.body.should.have.property("message");
                res.body.should.have
                    .property("message")
                    .eql("Checkin Complete");
                done();
            });
    });
});
