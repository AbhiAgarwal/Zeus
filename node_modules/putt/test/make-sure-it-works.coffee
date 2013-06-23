# TODO in package.json put kyuri or jasmine (under devDependencies)
# also add "scripts": { "test": "vows --spec" } or jasmine equivalent

putt = require '../index'

# test speaking and desktop notifications
putt().speak("Test 123 yoyo wassup").done ->
  putt().desktop_notify("Done speaking")

# start a test server to print out POST data it receives
express = require 'express'
server = express.createServer()
server.use(express.bodyParser())
server.post '/cool', (req, res) ->
  console.log "Received POST body:", req.body
  console.log "Received user-agent:", req.headers['user-agent']
  res.send ""
server.listen 3123

putt().post({"hot":"dog", "ham":"burger"}, {url: "http://localhost:3123/cool", headers: {"User-Agent": "not Google Chrome!"}})
.error (reason) ->
  console.log "PROBLEM..? #{reason}"
.done ->
  console.log "Done POSTing"
  
# test twitter
secrets = require './secrets'
putt(
  consumer_key: secrets.twitter.consumer_key
  consumer_secret: secrets.twitter.consumer_secret
  access_token: secrets.twitter.access_token
  access_token_secret: secrets.twitter.access_token_secret
).tweet("test tweet from twitter API").error((reason) -> console.log reason)

# test email
putt(
  user: secrets.email.username
  pass: secrets.email.password
).email("Test email 123", {to: secrets.email.recipient, subject: 'yo'}).done ->
  console.log "email sent!"
