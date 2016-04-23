$(function () {

    // init menu
    $.ajaxSetup({cache: false});

    $('nav ul').click(function () {
        var $this = $(this);
        var request = $this.data('dest') + '.html';
        var spinner = '<div class="loader">Loading!</div>';
        $('#content').html(spinner).load(request);
        $('#content').show();
    })

    // init accordions
    jQuery(".accordion").accordion({
        duration: 400,
        exclusive: false
    });

    // init bigfoot
    var bigfoot = $.bigfoot(
        {
            actionOriginalFN: "delete",
            footnoteTagname: "p",
            footnoteParentClass: "footnote",
            preventPageScroll: false,
            hoverDelay: 250
        }
    );
});