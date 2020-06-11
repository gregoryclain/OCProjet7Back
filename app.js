var mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

// gestion cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// connexion
console.log("Get connection ...");
var conn = mysql.createConnection({
  database: "ocp7",
  host: "localhost",
  user: "root",
  password: "",
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true, limit: "2b" }));
app.use("/images", express.static(path.join(__dirname, "images"))); // définition du répertoire statique d'upload d'images

// import des routes
// const userRoutes = require("./routes/user");
// const sauceRoutes = require("./routes/sauce");

// ajout des routes dans l'app
// app.use("/api/auth", userRoutes);
// app.use("/api/sauces", sauceRoutes);

module.exports = app;
