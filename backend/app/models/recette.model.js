const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Recette schema(collection)
const RecetteSchema = new Schema({
  Nom: { type: String, required: true },
  Ingredients: { type: Array, required: true },
  Image: { type: String },
  Etapes: { type: Array, required: true },
  Auteur: { type: String },
  Recette_pour: { type: Number },
  Hearts: { type: Number },
});
const Recette = mongoose.model("Recette", RecetteSchema);
module.exports = Recette;
