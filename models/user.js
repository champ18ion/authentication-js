const mongoose = require('mongoose');

// creating user Schema
const userSchema = new mongoose.Schema(
     {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
          unique: true,
        },
        password: {
          type: String,
          required: true,
        },
      },
      {
        timestamps: true,
      }
);

// validate the password with passed on user password
userSchema.methods.isValidatePassword = async function (userSentPassword) {
  return this.password === userSentPassword;
};

// exporting the schema
const User = new mongoose.model("User", userSchema);

module.exports = User;