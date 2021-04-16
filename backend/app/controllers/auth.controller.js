const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const nodemailer = require("nodemailer"),
  useragent = require("express-useragent");
var smtpTransport = require("nodemailer-smtp-transport");
const RequestIp = require("@supercharge/request-ip");
var jwt = require("jsonwebtoken");
const cdigit = require("cdigit");
var bcrypt = require("bcryptjs");
const { replaceOne } = require("../models/user.model");
//var geoip = require('geoip-lite');
//var ipLocation = require("ip-location");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      let textArray = ["user", "moderator", "admin"];
      let randomIndex = Math.floor(Math.random() * textArray.length);
      let randomElement = textArray[randomIndex];
      Role.findOne({ name: randomElement }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      // eslint-disable-next-line
      console.log(req.body);

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 50, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
};
exports.confirmPass = (req, res) => {
  User.findOne({
    email: req.body.user.email,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      // eslint-disable-next-line
      console.log(user);

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      User.findOneAndUpdate(
        { email: req.body.user.email },
        { password: bcrypt.hashSync(req.body.user.password, 8) },
        {}
      ).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        res.status(200).send({
          message: "Your password has been changed now login!",
        });
      });
    });
};
exports.qrcodeGuest = (req, res) => {
  var user = req.body.username;
  // eslint-disable-next-line
  console.log(user);
  var token = jwt.sign({ user: user }, config.secret, {
    expiresIn: 20, // 24 hours
  });
  var device, location;
  const userAgent = req.useragent;

  const request = require("request");
  const ip = RequestIp.getClientIp(req);
  const asArray = Object.entries(userAgent);

  // Use `filter()` to filter the key/value array
  const atLeast9Win = asArray.filter(([key, value]) => value == true);
  const atLeast9Wins = atLeast9Win.map((element) => {
    // eslint-disable-next-line
    console.log(element);
  });

  const atLeast9WinsObject = Object.fromEntries(atLeast9Win);
  var info = {}
  for (prop in atLeast9WinsObject) {
    info = {...info , prop}
  }
  // eslint-disable-next-line
  console.log(info);
  request(
    "https://api.ipgeolocationapi.com/geolocate/" + ip + "",
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        location = JSON.parse(body.name); 
        // eslint-disable-next-line
        console.log(location);
      }
    }
  );
  // var ip = "197.5.129.6";
  // ipLocation(ip, function (err, data) {
  //   // eslint-disable-next-line
  //   console.log(data);
  // });

  // eslint-disable-next-line
  //console.log(geo);
  // letip =
  //   req.headers["x-forwarded-for"] ||
  //    ||
  //    ||

  // eslint-disable-next-line
  // console.log(ip);
  if (token) {
    return res.status(200).send({ accessToken: token });
  } else {
    return res.status(401).send({ message: "can't generate token! try again" });
  }
};
exports.confirmtoken = (req, res) => {
  var token = req.body.token;
  console.log(token);

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: err });
    }

    res.status(200).send({ message: "token verified" });
  });
};
exports.resetPass = (req, res) => {
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // eslint-disable-next-line
    console.log(req.body);

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    let transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: "youssribentaghalline@gmail.com",
          pass: "azertyuiop22836598",
        },
      })
    );
    var token = jwt.sign({ email: user.email }, config.secret, {
      expiresIn: 10000, // 24 hours
    });
    const mailOptions = {
      from: "youssribentaghalline@gmail.com",
      to: user.email,
      subject: "Password reset",
      html:
        '<p>Click <a href="http://localhost:8081/reset/' +
        token +
        '">here</a></p>',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(401).send({
          accessToken: null,
          message: "There is an error try again!",
        });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send({
          email: user.email,
          Token: token,
        });
      }
    });

    
  });
};
exports.emailCodelogin = (req, res) => {
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // eslint-disable-next-line
    console.log(req.body);

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    let transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: "youssribentaghalline@gmail.com",
          pass: "azertyuiop22836598",
        },
      })
    );
    var code = cdigit.luhn.generate(
      Math.floor(Math.random() * (99999 - 10000)) + 10000
    );
    console.log(code);
    const mailOptions = {
      from: "youssribentaghalline@gmail.com",
      to: user.email,
      subject: "Verification Code",
      html: "<p>Your verification code is :" + code + "</p>",
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(401).send({
          code: null,
          message: "There is an error try again!",
        });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send({
          confirmation: "Code has been send to your email !",
        });
      }
    });
  });
};
exports.confirmCode = (req, res) => {
  var Code = req.body.code;
  // eslint-disable-next-line
  console.log(req.body);
  let validateCode = cdigit.luhn.validate(Code);
  if (validateCode) {
    res.status(200).send({ message: "Code verified" });
  } else {
    res.status(404).send({ message: "Invalid Code" });
  }
};
