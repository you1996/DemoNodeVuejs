const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodecouch = require("node-couchdb");
const app = express();
var useragent = require('express-useragent');
 
app.use(useragent.express());
var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const couch = new nodecouch({
  auth: { user: "admin", password: "admin" },
});

couch.listDatabases().then(function (dbs) {
  // eslint-disable-next-line
  console.log(dbs);
});
couch
  .insert("authapp", {
    _id: "user:akzakjzak",
    field: ["sample", "data", true],
  })
  .then(
    ({ data, headers, status }) => {
      // eslint-disable-next-line
      console.log(data); // data is json response
      // headers is an object with all response headers
      // status is statusCode number
    },
    (err) => {
      // eslint-disable-next-line
      console.log(err);
      // either request error occured
      // ...or err.code=EDOCCONFLICT if document with the same id already exists
    }
  );
db.mongoose
  .connect(
    `mongodb+srv://chgh:passwordmongo@cluster0.cmtlq.mongodb.net/Cluster0?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the authentication demo application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
 

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
/**
 * Create the three roles(user , moderator , admin) collections in the database
 */
function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
