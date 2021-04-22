const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const nodemailer = require("nodemailer"),
  smtpTransport = require("nodemailer-smtp-transport");
var jwt = require("jsonwebtoken");
const cdigit = require("cdigit");
var bcrypt = require("bcryptjs");

/**
* check if a user exist or no in the data base, if no then save it and contribute a random role (just)
  for testing, in production roles are not random
* @param {object} req user credentials
* @returns nothing
*/
exports.signup = (req, res) => {
  var userAgent, request;
  var ArrayInfo = [],
    currentUserInfo,
    info = "";
  userAgent = req.useragent;
  request = require("request");
  ArrayInfo = Object.entries(userAgent);
  currentUserInfo = Object.fromEntries(
    ArrayInfo.filter(([key, value]) => value == true)
  );
  for (prop in currentUserInfo) {
    var s = prop.replace("is", "");
    info = info.concat(s + " ");
  }
  request(
    "https://api.ipgeolocationapi.com/geolocate/197.5.129.6",
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var location = JSON.parse(response.body);
        info = info.concat(location.name);
      }
    }
  );
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    informations: info,
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

/**
 * find the user record, sign a jwt token , verify the device connection
 * @param {string} req username
 * @returns {object} user record and a jwt token
 */
exports.signin = (req, res) => {
  var authorities = [],
    token,
    passwordIsValid,
    userAgent,
    request;
  var ArrayInfo = [],
    currentUserInfo,
    info = "";
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      //compare the hached passwords(the one in the database and the user input)
      passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      //sign a jwt token with an expiration date
      token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 900,
      });

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      //get the useragent
      userAgent = req.useragent;
      request = require("request");
      ArrayInfo = Object.entries(userAgent);
      currentUserInfo = Object.fromEntries(
        ArrayInfo.filter(([key, value]) => value == true)
      );
      for (prop in currentUserInfo) {
        var s = prop.replace("is", "");
        info = info.concat(s + " ");
      }
      request(
        "https://api.ipgeolocationapi.com/geolocate/197.5.129.6",
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var location = JSON.parse(response.body);
            info = info.concat(location.name);
          }
        }
      );
      if(user.informations != info){
        console.log(user.username)
        console.log(info)
        ////////////////
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
       
        const mailOptions = {
          from: "youssribentaghalline@gmail.com",
          to: user.email,
          subject: "Device Notification",
          html:
            'Another device detected : '+ info +'',
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return res.status(401).send({
              
              message: "There is an error try again!",
            });
          } else {
            console.log("Email sent: " + info.response);
            
          }
        });
        ////////////////////

      }
      
      setTimeout(() => {
        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          info: info,
        });
      }, 1000);
    });
};

/**
 * generate a jwt token and send it back to the frontend
 * @param {object} req user object
 * @param {string} res token
 * @returns a token if ok else error message
 */
exports.qrcodeGuest = (req, res) => {
  var user, token;
  user = req.body.username;
  token = jwt.sign({ user: user }, config.secret, {
    expiresIn: 800, // 24 hours
  });
  if (token) {
    return res.status(200).send({ accessToken: token });
  } else {
    return res.status(401).send({ message: "can't generate token! try again" });
  }
};

/**
 * send the reset link to the user email
 * @param {string} req user input(email)
 * @param {object} res token
 */
exports.resetPass = (req, res) => {
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    let transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: "youssribentaghalline@gmail.com",
          pass: "password",
        },
      })
    );
    var token = jwt.sign({ email: user.email }, config.secret, {
      expiresIn: 10000,
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
/**
 * verifies the token
 * @param {string} req token sent in the reset link
 * @param {httpcode} res if OK => 200 else => 401
 */
exports.confirmtoken = (req, res) => {
  var token = req.body.token;
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: err });
    }

    res.status(200).send({ message: "token verified" });
  });
};
/**
 * find the user record and update the password
 * @param {object} req user object
 * @param {string} res if OK=> 200 else=> 500 error
 */
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
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      //find and update the user password
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
/**
 * check the existance of a user and send the code to this address
 * @param {string} req user email
 * @param {string} res email ,http response
 */
exports.emailCodelogin = (req, res) => {
  var transporter, code, mailOptions;
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: "youssribentaghalline@gmail.com",
          pass: "azertyuiop22836598",
        },
      })
    );
    //generates a random alphanumeric code
    code = cdigit.mod37_2.generate(Math.random().toString(36).substr(2, 6));
    mailOptions = {
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
/** 
Verifies the returned code and confirm 
* @param {string} req code
* @return confirmation (true or false)
*/
exports.confirmCode = (req, res) => {
  var Code = req.body.code;
  let validateCode = cdigit.mod37_2.validate(Code);
  if (validateCode) {
    res.status(200).send({ message: "Code verified" });
  } else {
    res.status(500).send({ message: "Invalid Code" });
  }
};
