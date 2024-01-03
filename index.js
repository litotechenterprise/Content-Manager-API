const express = require("express");
const path = require("path");
const pathToFile = path.resolve("./data/resources.json");
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require("cors");
const fs = require("fs");

let corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

const getResource = () => JSON.parse(fs.readFileSync(pathToFile));

app.use(cors(corsOptions));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get("/api/resources/active", (req, res) => {
  const resources = getResource();
  const resource = resources.find((resource) => resource.status === "active");
  if (!resource) {
    return res.send({ message: "None Found" });
  }
  res.send(resource);
});

app.get("/api/resources", (req, res) => {
  const resource = getResource();
  res.send(resource);
});

app.get("/api/resources/:id", (req, res) => {
  const resources = getResource();
  const { id } = req.params;
  const resource = resources.find((resource) => resource.id === id);
  res.send(resource);
});

app.post("/api/resources", (req, res) => {
  const resources = getResource();
  const resource = req.body;
  resource.id = Date.now().toString();
  resource.createdAt = new Date();
  resource.status = "inactive";
  resources.unshift(resource);
  fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (err) => {
    if (err) {
      return res.status(422).send("Cannot store data in file");
    }
    return res.send("Data has been saved");
  });
});

app.patch("/api/resources/:id", (req, res) => {
  const resources = getResource();
  const { id } = req.params;
  const index = resources.findIndex((resource) => resource.id === id);

  if (resources[index].status === "complete") {
    return res.status(422).send("Cannont update completed resource");
  }

  const activeResource = resources.find(
    (resource) => resource.status === "active"
  );
  resources[index] = req.body;

  if (req.body.status === "active") {
    if (activeResource) {
      return res.status(422).send("There is active resource already");
    }
    resources[index].status = "active";
    resources[index].activationTime = new Date();
  }

  fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (err) => {
    if (err) {
      return res.status(422).send("Cannot store data in file");
    }
    return res.send("Resource has been updated");
  });
});

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});
