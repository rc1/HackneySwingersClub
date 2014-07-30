# Hackney Swingers Club @ Hackney Wicked Festival

If you want to run it, you will need node.js and GStreamer installed. To install on a mac, presuming you have homebrew installed – do this in the terminal:

    brew install nodejs gstreamer gst-plugins-base gst-libav gst-plugins-good gst-plugins-bad gst-plugins-ugly

I’ve not got ubuntu to hand, but I am 90% sure this should work:

    apt-get install nodejs nodejs-legacy gstreamer gst-plugins-base gst-libav gst-plugins-good gst-plugins-bad gst-plugins-ugly

Then once they are installed, go to the repo’s folder in github. First time run this:

    npm install

Then to run the app

    node app.soundrecorder.js

And open this page in safari

    http://localhost:3000/

_I think :)_

Recordings should go in the recordings folder
