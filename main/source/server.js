const app = require("./app");
require("dotenv").config();

const port = process.env.MAIN_PORT || 3000;
app.listen(port, "127.0.0.1", () => {
  console.log(`Main app is running on port ${port} ...`);
});
