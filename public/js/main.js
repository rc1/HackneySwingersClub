var fadeSpeed = 300;

$( function () {

    var swing = 0;

    // The paging of the screens
    var screens = $( '.screen' )
        .fadeOut( 0 )
        .on( 'click touch', function () {
            if ( canTouchAnywhere( this ) ) {
                displayNextScreen( screens, this );
            }
            console.log( 'swing', swing );
        })
        .each( function ( i, el ) {
            // Get the selection buttons
            $( this )
                .find( '.selection' )
                .on( 'click touch', function () {
                    if ( $( this ).data( 'swing' ) ) {
                        swing = $( this ).data( 'swing' );
                    }
                    displayNextScreen( screens, el );
                });
            // Get the hold button
            $( this )
                .find( '.hold' )
                .on( 'mousedown touchstart', function ( ) {
                    var $this = $( this );
                    $this.text( 'Recording' );
                    startRecording( swing );
                    var timeoutId = 0;
                    var handler = function () {
                        stopRecording();
                        timeoutId = setTimeout( function () {
                            clearTimeout( timeoutId );
                            $this.text( 'Touch and hold' );
                            displayNextScreen( screens, el );
                            $( document ).off( 'mouseup touchend', handler );
                        }, 1000 );
                    };
                    $( document ).on( 'mouseup touchend', handler );
                });
            // Do it again, steps back a screen
            $( this )
                .find( '.doItAgain' )
                .on( 'click touch', function () {
                    $( '.touchAndHold' ).fadeIn( fadeSpeed );
                    $( el ).fadeOut( fadeSpeed );
                });
            // I Liked it
            $( this )
                .find( '.iLikedIt' )
                .on( 'click touch', function () {
                    done();
                    displayNextScreen( screens, el );
                });
        })
        .first()
        .fadeIn( fadeSpeed );
    
});


// # Utils

// ## Recording

function startRecording ( swing ) {
    console.log( 'start recording' );
    handleGetError( $.get( '/startRecording/' + swing + '/' ) );
}

function stopRecording () {
    console.log( 'end recording' );
    handleGetError( $.get( '/endRecording/' ) );
}

function done () {
    console.log( 'notify new recording ' );
    handleGetError( $.get( '/done/' ) );
}

function handleGetError( get ) {
    get.fail( function ( err ) {
        console.log( 'failed!', err );
    });
}

// ## Screens

function displayNextScreen( screenEls, currentScreenEl ) {
    $( currentScreenEl ).fadeOut( fadeSpeed );
    next( screenEls, currentScreenEl ).fadeIn( fadeSpeed );
}

function next ( elCollection, needleEl ) {
    var nextEl = $( needleEl ).next();
    return ( nextEl.length > 0 ) ? nextEl : elCollection.first();
}

function canTouchAnywhere ( el ) {
    return $( el ).find( '.selection' ).length === 0 && $( el ).find( '.hold' ).length === 0 && $( el ).find( '.iLikedIt' ).length === 0;
}
