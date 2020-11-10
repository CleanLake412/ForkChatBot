/* javascriptのコードを記載 */

function hide_loading() {
    localStorage.setItem("pipe-talk-access","on");
    $('#mv-movie-load-wrapper').hide();
    // $('#mv-movie-gif').css('opacity', '1.0');
    $('#mv-movie-gif').show();
    /* $('#loading').fadeOut();
    console.log('i am hide_loading');
    */
}

$(function() {
    /* $(window).on('load', function() {
        console.log('i am window.load');
        setTimeout(function(){
            hide_loading();
        }, 3000);
    }); */

    $('#mv-movie-load-gif').on('load', function() {
        setTimeout(function(){
            hide_loading();
        }, 5000);
    });

    /* $(document).ready(function() {
        setTimeout(function(){
            console.log('i am timer.4000');
            hide_loading();
        }, 5000);
    }); */

    /* setTimeout(function(){
        console.log('i am timer.1000');
    }, 1000); */

    var cookie_value = localStorage.getItem("pipe-talk-access");
    if(cookie_value != null && cookie_value == "on") {
        hide_loading();
    }
});
