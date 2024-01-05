const mongoose = require('mongoose');

module.exports = {
  connect: () => {
    const DB = process.env.AS_DATABASE;
    mongoose.connect(DB).then(() => console.log('Aux DB connection successful!'));
  },
};