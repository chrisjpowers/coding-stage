everyauth = require 'everyauth'
mongoose = require "mongoose"
mongooseAuth = require 'mongoose-auth'
pusher = require "pusher"
AppConfig = require "config/app-config"

authOptions =
  everymodule:
    everyauth:
      User: -> return User
  password:
    loginWith: 'email'
    everyauth:
      getLoginPath: '/new-session'
      postLoginPath: '/login'
      loginView: 'session-form.ejs'
      loginLocals:
        pusher: pusher
      getRegisterPath: '/new-session'
      postRegisterPath: '/register'
      registerView: 'session-form.ejs'
      registerLocals:
        pusher: pusher
      loginSuccessRedirect: '/'
      registerSuccessRedirect: '/'
  github:
    everyauth:
      myHostname: AppConfig.github.hostname
      appId: AppConfig.github.appId
      appSecret: AppConfig.github.appSecret
      redirectPath: '/'

Promise = everyauth.Promise
Schema = mongoose.Schema
ObjectId = mongoose.SchemaTypes.ObjectId
UserSchema = new Schema({})
UserSchema.plugin mongooseAuth, authOptions

User = mongoose.model('User', UserSchema)

module.exports = User
