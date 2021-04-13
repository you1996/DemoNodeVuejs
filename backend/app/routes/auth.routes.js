const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/signinguest", controller.qrcodeGuest);
  app.post("/api/auth/forgot", controller.resetPass);
  app.post("/api/auth/changepassword", controller.confirmPass);
  app.post("/api/auth/confirmtoken", controller.confirmtoken);
  app.post("/api/auth/emailCodelogin", controller.emailCodelogin);
  app.post("/api/auth/confirmcode", controller.confirmCode);






};
