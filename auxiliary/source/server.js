const app = require("./app");
const fs = require("fs");
const https = require("https");
const path = require("path");
const database = require("../config/db.config");
require("dotenv").config();

database.connect();
const port = process.env.AUX_PORT || 5001;
const host = process.env.HOST || "0.0.0.0";

const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "../cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "../cert", "cert.pem")),
  },
  app
);
server.listen(port, host, () => {
  console.log(`Auxiliary server is running on port ${port} ...`);
});
