mongoose = require "mongoose"
Schema = mongoose.Schema
ObjectId = Schema.ObjectId
Comment = require "./comment"

Stage = new Schema
  name:
    type: String
  creatorId:
    type: ObjectId
  language:
    type: String
  contributorIds:
    type: Array
  comments: [Comment]
    


module.exports = mongoose.model 'Stage', Stage
