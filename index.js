const express = require("express");
const path = require("path");
const pathToFile = path.resolve("./data/resources.json");
const app = express();
const PORT = 3001;

const fs = require("fs");

const getResource = () => JSON.parse(fs.readFileSync(pathToFile));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/resources", (req, res) => {
  const resource = getResource();
  res.send(resource);
});

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
