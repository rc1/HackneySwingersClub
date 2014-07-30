// # Modules
var spawn = require( 'child_process' ).spawn;
var W = require( 'w-js' );
var express = require( 'express' );
var osc = require( 'node-osc' );

// # Globals
var currentRecordingProcess;
var currentFilename;
var currentSwing;
var app = express();

// # OSC
var client = new osc.Client( '127.0.0.1', 3333 );

// # Express

app.use( express.static( './public' ) );

app.get( '/startRecording/:swing/', function( req, res ) {
    // Start the recording
    console.log( 'started recording' );
    currentFilename = makeUniqueFilepath();
    currentSwing = parseInt( req.params.swing, 10 );
    currentRecordingProcess = startRecordingProcess( currentFilename );
    // Send OK
    res.status( 200 ).end();
});

app.get( '/endRecording/', function( req, res ) {
    console.log( 'ending recording' );
    currentRecordingProcess.kill( 'SIGINT' );
    // Send OK
    res.status( 200 ).end();
});

app.get( '/done/', function( req, res ) {
    // Send the OSC
    console.log( 'sending osc message' );
    var msg =  new osc.Message('/recording');
    msg.append( currentSwing );
    msg.append( currentFilename );
    client.send( msg );
    // Send the filepath
    res.status( 200 ).end();
});

var server = app.listen( 3000, function() {
    console.log('Listening on port %d', server.address().port);
});

// # Sound Recording

var startRecordingProcess = W.compose(
    makeGstPipeline,
    spawnGstProcess
    //W.partialRight( processLogger, 'GST:' )
);

// # Utils

// ## Filenaming

function makeUniqueFilepath ( ) {
    return './recordings/' + Date.now() + '.wav';
}

// ## Gst

function makeGstPipeline ( filepath ) {
    return [
        'autoaudiosrc', 'num-buffers=100',
        '!', 'audioconvert',
        '!', 'wavenc',
        //'!', 'vorbisenc', 
        //'!', 'oggmux', 
        '!', 'filesink', 'location="' + filepath + '"'
    ];
}

function spawnGstProcess ( pipeline ) {
    return spawn( 'gst-launch-1.0', pipeline, null );
}

// ## Process

function exitProcessAfter ( process, afterMS, callback ) {
    setTimeout( function () {
        process.kill( 'SIGINT' );
        W.call( callback );
    }, afterMS );
    return process;
}

function processLogger ( process, title ) {
    var prepend = title || "process: ";
    
    process.stdout.on( 'data', function ( data ) {
        console.log( prepend + data);
    });
    
    process.stderr.on( 'data', function ( data ) {
        console.log( prepend + data);
    });
    
    process.on( 'close', function ( code ) {
        console.log( prepend + code);
    });

    return process;
}