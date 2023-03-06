const mongoose = require('mongoose')
require('dotenv').config();
// connecting to database
mongoose.connect(process.env.MONGODB_URI);

// acquiring the db connection
const db = mongoose.connection;

// checking for the error
db.on("error", console.error.bind(console, "error in connecting the database"));

// up and running then print the statement
db.once("open", () => {
  console.log("succesfully connected to database");
});

// exporting the connection
module.exports = db;