const app = require("./app");
require("dotenv").config();

const port = process.env.AUX_PORT || 5001;
app.listen(port, "127.0.0.1", () => {
  console.log(`Auxiliary app is running on port ${port} ...`);
});
