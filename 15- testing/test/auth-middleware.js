const authMiddleware = require("../middleware/is-auth");
const expect = require("chai").expect;
const jwt  = require('jsonwebtoken')
const sinon = require('sinon')

describe("auth middleware", function () {
  it("should throw an error if no auth header", function () {
    const req = {
      get: function () {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should throw an error if the auth header is only one string", function () {
    const req = {
      get: function () {
        return "xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should throw an error if the the token cannot be verified", function () {
    const req = {
      get: function () {
        return "Bearer xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yield a userId after decoding the token", function () {
    const req = {
      get: function () {
        return "Bearer sdfsdfszfssdfxyz";
      },
    };
    sinon.stub(jwt, 'verify')
    jwt.verify.returns({userId: 'abc'})
    authMiddleware(req, {}, () => {})
    expect(req).to.have.property('userId')
    expect(req).to.have.property('userId','abc')
    expect(jwt.verify.called).to.be.true
    jwt.verify.restore()
  });
});
