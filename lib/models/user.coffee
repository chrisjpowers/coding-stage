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
      getLoginPath: '/login'
      postLoginPath: '/login'
      loginView: 'session-form.ejs'
      loginLocals:
        pusher: pusher
        formType: 'login'
      getRegisterPath: '/register'
      postRegisterPath: '/register'
      registerView: 'session-form.ejs'
      registerLocals:
        pusher: pusher
        formType: 'register'
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

mongoose.model('User', UserSchema)
User = mongoose.model('User')
