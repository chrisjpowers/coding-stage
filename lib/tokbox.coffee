opentok = require 'opentok'
appConfig = require 'config/app-config'

OPENTOK_API_KEY = appConfig.opentok.key
OPENTOK_API_SECRET = appConfig.opentok.secret

ot = new opentok.OpenTokSDK(OPENTOK_API_KEY,OPENTOK_API_SECRET)
ot.key = OPENTOK_API_KEY

module.exports = ot
