# should work on other BSD operating systems, but probably not on Windows
unless process.platform in ['darwin', 'linux']
  console.warn "WARN: putt may not work on your platform (#{process.platform})"

r_growl = require 'growl'
r_say = require 'say'
r_restler = require 'restler'
r_ntwitter = require 'ntwitter'
r_nodemailer = require 'nodemailer'

class exports.Putt
  constructor: (@config) ->
    #TODO eventually do stuff with config (email, etc)
    @done_fn
    @error_fn
    @errored = false
    @finished = false
  
  done: (@done_fn) =>
    @done_fn() if @finished
    this
  
  error: (@error_fn) =>
    @error_fn(@errored) if @errored
    this

  speak: (text, options = {}) =>
    options.voice ?= "Alex"
    r_say.speak(options.voice, text, @on_done)
    this
  
  desktop_notify: (text, options = {}) =>
    r_growl.notify(text, options, @on_done)
    this
  
  post: (query_hash, options = {}) =>
    if options.url?
      url = options.url
      delete options.url
      options.data = query_hash
      r_restler.post(url, options).on('success', @on_done).on('error', @on_error)
    else
      @on_error("Please specify a URL")
    this
  
  email: (text, options = {}) =>
    #TODO config here is bad
    r_nodemailer.SMTP =
      host: @config.host || 'smtp.gmail.com'
      port: @config.port || 465
      ssl: @config.ssl || true
      use_authentication: @config.use_authentication || true
      user: @config.user
      pass: @config.pass
    options.sender ?= @config.user
    options.body = text
    r_nodemailer.send_mail(options, (error, success) =>
      if success?
        @on_done()
      else
        if error? then @on_error(error) else @on_error("Server wasn't able to process message correctly")
    )
    this
  
  tweet: (text, options = {}) =>
    #TODO config here is bad
    twitter = new r_ntwitter(
      consumer_key: @config.consumer_key
      consumer_secret: @config.consumer_secret
      access_token_key: @config.access_token
      access_token_secret: @config.access_token_secret
    )
    twitter.verifyCredentials((err, data) =>
      @on_error(err) if err?
    ).updateStatus(text, (err, data) =>
      if err? then @on_error(err) else @on_done()
    )    
    this
  
  # below methods shouldn't be called directly
  on_done: =>
    @finished = true
    @done_fn() if @done_fn?

  on_error: (reason) =>
    @errored = reason || true
    @error_fn(reason) if @error_fn?
