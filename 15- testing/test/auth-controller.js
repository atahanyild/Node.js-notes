const sinon = require("sinon");
const expect = require("chai").expect;

const User = require("../models/user");
const AuthController = require("../controllers/auth");

const mongoose = require("mongoose");
describe("Auth Controller- login", function () {
  before(function (done) {
    mongoose
      .connect(
        "mongodb+srv://atahanyild:03atahan42@cluster0.vp4igzj.mongodb.net/test-messages"
      )
      .then((result) => {
        const user = new User({
          email: "test@test.com",
          password: "tester",
          name: "Test",
          posts: [],
          _id: "5c0f66b979af55031b34728a",
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });
  //   it("should throw an error 500 if accessing the database fails", function (done) {
  //     sinon.stub(User, "findOne");
  //     User.findOne().throws();

  //     const req = {
  //       body: {
  //         email: "atahan@hotnail.com",
  //         password: "tester",
  //       },
  //     };

  //     AuthController.login(req, {}, () => {}).then((result) => {
  //       console.log(result);
  //       expect(result).to.be.an("error");
  //       expect(result).to.have.property("statusCode", 500);
  //       done();
  //     });

  //     User.findOne.restore();
  //   });

  it("should send a response with a valid user status for an existing user ", function () {
    const req = {
      userId: "5c0f66b979af55031b34728a",
    };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    AuthController.getUserStatus(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal("i am new");
        done()
      })
  });

  after(function(done){
    User.deleteMany({}).then(() => {
        mongoose.disconnect().then(() => {
          done();
        });
      });
  })
});
