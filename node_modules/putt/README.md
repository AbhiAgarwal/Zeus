**putt** is a node.js module that lets you easily output text in lots of fun ways. It wraps a bunch of other libraries to make this as simple as possible.

```javascript
var putt = require("putt");
putt().speak("This is spoken aloud by your computer");
putt().desktop_notify("This appears as a desktop notification");
```

Supported output formats:

* Speech synthesizer (by [say.js](https://github.com/Marak/say.js))
* Desktop notification (by [node-growl](https://github.com/visionmedia/node-growl))
* POST request (by [restler](https://github.com/danwrong/restler))
* Email (by [nodemailer](https://github.com/andris9/nodemailer))
* Tweet (by [ntwitter](https://github.com/AvianFlu/ntwitter))
* More coming soon... (SMS/call - twilio API, ???)

# Install

First, install [Node.JS](http://nodejs.org/) and [NPM](http://npmjs.org/). Then, `cd` into your project folder and run:

    npm install putt

For `speak` to work on Linux, install [Festival](http://www.cstr.ed.ac.uk/projects/festival/) and see what voices you have available (e.g. `voice_rab_diphone`).

For `desktop_notify` to work, install:

* Mac: [growl](http://code.google.com/p/growl/downloads/list), including the `growlnotify` extra
* Linux: `notify-send` with `sudo apt-get install libnotify-bin` or equivalent

# Usage

All output types take an options hash (optional), e.g.:

```javascript
putt().speak("I am talking", {voice: "Bruce"});
```

All output types also have two optional callbacks that can be chained:

* `done()` is called when the output finishes outputting
* `error(reason)` is called when an error is encountered during output

For example:

```javascript
putt().speak("I am talking").done(function() {
    console.log("Finished talking");
}).error(function(reason) {
    console.log("Something went wrong:", reason);
});
```

Note that you can chain these method calls in any order:

```javascript
putt().done(function() {
    console.log("Finished talking");
}).speak("I am talking");
```

## Speech

```javascript
putt().speak("This is spoken");
```
    
Options:

* `voice` the voice to use when speaking.

[See say.js docs](https://github.com/Marak/say.js) for a full list of voices

## Desktop notification

```javascript
putt().desktop_notify("This is a desktop notification");
```

Options:

* `title` the title of the notification window
* `name` the name of the application
* `priority` (integer) the priority of the notification (default is 0)
* `sticky` (boolean) if notification should fade away or not
* `image` custom image to show along with notification

[See node-growl docs](https://github.com/visionmedia/node-growl) for more details

## POST request

```javascript
putt().post({param1: "value1", param2: "value2"}, {url: 'http://example.com/whatever'});
```

Options:

* `url` (required) the URL to POST to
* `headers` a hash of HTTP headers to be sent

[See restler docs](https://github.com/danwrong/restler) for more details

## Email

By default, email assumes that the sender is a Gmail user.

```javascript
putt({
    user: 'sender@gmail.com',
    pass: 'sender_password'
}).email("Body of email", {to: 'recipient@example.com', subject: 'yo'});
```

Options:

* `to` (required) the recipient email address
* `subject` the subject for the email
* `host` the SMTP host
* `port` (integer) the SMTP port
* `ssl` (boolean) whether or not to use SSL

[See nodemailer docs](https://github.com/andris9/nodemailer) for more details

## Tweet

First, [create a new Twitter application](https://dev.twitter.com/apps/new), and under the "Settings" tab, you will also want to give your app "Read and write" permissions so that we can write a tweet. Then, click the button at the bottom of the "Details" tab to generate an access token and secret.

Next, provide those keys and secrets to putt when you call it:

```javascript
putt({
    consumer_key: "your consumer key",
    consumer_secret: "your consumer secret",
    access_token: "your access token",
    access_token_secret: "your access token secret"
}).tweet("This text will be tweeted by your account");
```
