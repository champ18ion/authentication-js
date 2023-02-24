const mongoose = require('mongoose')

// connecting to database
mongoose.connect('mongodb+srv://champ18ion:1V1q1XMHGIyNLfNL@cluster0.jxaps7z.mongodb.net/authenticate');

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