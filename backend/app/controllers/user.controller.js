const Recette = require("../models/recette.model");
exports.allAccess = (req, res) => {
    //////Get all recettes from the DB
      Recette.find({}, (error, recette) => {
        if (error) {
          console.log(error);
        }
        res.send(recette);
      });
    };

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  Recette.find({}, (error, recette) => {
    if (error) {
      console.log(error);
    }
    res.send(recette);
  });
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
