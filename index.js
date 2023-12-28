const express = require("express");
const path = require("path");
const pathToFile = path.resolve("./data/resources.json");
const app = express();
const PORT = 3001;
const cors = require("cors");
const fs = require("fs");

let corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

const getResource = () => JSON.parse(fs.readFileSync(pathToFile));

app.use(cors(corsOptions));
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
