const mongoose = require('mongoose');

const DB = process.env.DB;

mongoose
  .connect(DB)
  .then(con => {
    console.log('connection successful');
  })
  .catch(err => {
    console.log('the error is ' + err);
  });
