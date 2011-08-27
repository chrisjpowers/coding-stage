mongoose = require "mongoose"
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

Comment = new Schema
  message:
    type: String
  author:
    type: String

module.exports = mongoose.model "Comment", Comment
