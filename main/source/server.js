const app = require("./app");
const database = require("../config/db.config");
require("dotenv").config();

database.connect();
const port = process.env.MAIN_PORT || 3000;
const host = process.env.HOST || "127.0.0.1";
app.listen(port, host, () => {
  console.log(`Main app is running on port ${port} ...`);
});
