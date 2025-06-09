const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Servir les fichiers statiques (CSS, images, JS client)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { error: null });
});

app.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});
