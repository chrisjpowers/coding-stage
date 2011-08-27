mongoose = require "mongoose"
Schema = mongoose.Schema
ObjectId = Schema.ObjectId
Email = mongoose.SchemaTypes.Email

User = new Schema
  name:
    type: String
  email:
    type: Email
  githubUsername:
    type: String


module.exports = mongoose.model 'User', User
