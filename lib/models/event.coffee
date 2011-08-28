mongoose = require "mongoose"
Schema = mongoose.Schema
ObjectId = Schema.ObjectId
_ = require "underscore"

Event = new Schema
  title:
    type: String
  language:
    type: String
  desc:
    type: String
  startDate:
    type: Date
  imgUrl:
    type: String
  createdAt:
    type: Date
  stageUrl:
    type: String

module.exports = mongoose.model 'Event', Event
