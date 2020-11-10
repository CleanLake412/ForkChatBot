
function openFCB(isPerspective) {

    var modal = $('#modal-1'),
        close = $('.md-close'),
        overlay = $( '.md-overlay' )[0];

    function removeModal( hasPerspective ) {
        modal.removeClass('md-show' );

        if( hasPerspective ) {
            $(document.documentElement).removeClass( 'md-perspective' );
        }
    }

    function removeModalHandler() {
        removeModal( isPerspective );
    }

    modal.addClass( 'md-show' );
    overlay.removeEventListener( 'click', removeModalHandler );
    overlay.addEventListener( 'click', removeModalHandler );

    if (isPerspective) {
        setTimeout( function() {
            $(document.documentElement).addClass( 'md-perspective' );
        }, 25 );
    }

    close[0].addEventListener( 'click', function( ev ) {
        ev.stopPropagation();
        removeModalHandler();
    });
}