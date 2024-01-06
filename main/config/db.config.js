const mongoose = require('mongoose');

module.exports = {
  connect: () => {
    const DB = process.env.MS_DATABASE;
    mongoose.connect(DB).then(() => console.log('Main DB connection successful!'));
  },
};