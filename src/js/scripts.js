/* All the stuff that needs to happen every time a page is accessed directly or the pjax-container is loaded. */

//$(document).ready(function($) {
$(function () {
    initOnlyOnDirectAccess();
    initCurrentPage();
});

/**
 * Stuff that happens in other elements than pjax-container needs to happen only once.
 */
function initOnlyOnDirectAccess() {
    console.log("initDirect");
    
    initNav();
    initPjax();
}

/**
 * Stuff that happens inside the pjax-container needs to be done after each load.
 */
function initCurrentPage() {
    console.log("initcurrent");

    initBigfoot();
    initAccordion();
    initWhatever();
    initScrollTo();
}


function initBigfoot() {
    var bigfoot = $.bigfoot(
        {
            actionOriginalFN: "delete",
            footnoteTagname: "p",
            footnoteParentClass: "footnote",
            preventPageScroll: false,
            hoverDelay: 250
        }
    );
}

function initAccordion() {
    jQuery('.accordion').accordion({
        duration: 400,
        exclusive: false
    });
}

function initWhatever() {
    // init menu (??)
    $.ajaxSetup({cache: false});

    // show spinner
    //$('.nav2-title').click(function () {
    //    console.log("heyYyXXXX");
//
    //    var $this = $(this);
    //    var request = $this.data('dest') + '.html';
    //    var spinner = '<div class="loader">Loading!</div>';
    //    $('#content-pane').html(spinner).load(request);
    //    $('#content-pane').show();
    //})
}

function initNav() {

    var snapper = new Snap({
        //element: document.getElementById('content-pane')
        element: document.getElementById('content-pane')
    });

    //checkSnapperAfterResize(snapper);

    snapper.settings({
        disable: 'right',
        //    addBodyClasses: true,
        hyperextensible: false,
        //    resistance: 0.5,
        //    flickThreshold: 50,
        //    transitionSpeed: 0.3,
        //    easing: 'ease',
            maxPosition: 300,
        tapToClose: true
        //    touchToDrag: true,
    });

    var menuToggleButton = document.getElementById('menu-toggle');
    menuToggleButton.addEventListener('click', function () {

        if (snapper.state().state == "left") {
            snapper.close();
        } else {
            snapper.open('left');
        }
    });

    $(window).resize(function () {
        checkSnapperAfterResize(snapper);
    });
    
    
    

    // hide nav containers
    //$('.nav1-inner-container').hide();
    
    $('.nav1-title').click(function(){

        //Expand or collapse this panel
        $(this).next().slideToggle('medium');

        //Hide the other panels
        $('.nav1-inner-container').not($(this).next()).slideUp('fast');
        $('.nav2-inner-container').slideUp('fast');
    });

    $('.nav2-title').click(function(){

        //Expand or collapse this panel
        var nextNav2Container = $(this).next();

        if (nextNav2Container.hasClass('nav2-inner-container')) {
            nextNav2Container.slideToggle('medium');

            //Hide the other panels
            $('.nav2-inner-container').not(nextNav2Container).slideUp('fast');
        }
    });
}

function initPjax() {
    $('body').on('click', '.nav2-title', function (event) {
        $.pjax({
            "url": $(this).attr("href"),
            "fragment": "#pjax-container",
            "container": "#pjax-container"
        });
        event.preventDefault();
    });

    //$(document).on('pjax:start', function () {
    //});

    $(document).on('pjax:end', function () {
        initCurrentPage();
        highlightActiveMenuItem();
    });
}

function initScrollTo() {
    var windowHeight = $(window).height(); // get the height of the window
    var docHeight = $(document).height();

    if (docHeight > 3 * windowHeight) {
        $("#back-to-top").click(function (evn) {
            evn.preventDefault();
            evn.stopImmediatePropagation();
            $(window).scrollTo(0, 400);
        });
    }
    else {
        $('#back-to-top').hide();
    }


    /**
     * This part causes smooth scrolling using scrollto.js
     * We target all a tags inside the nav, and apply the scrollto.js to it.
     */
    $(".nav3-title").click(function (evn) {
        evn.preventDefault();
        evn.stopImmediatePropagation();
        $(window).scrollTo(this.hash, this.hash, {offset: -100});
    });

    /**
     * This part handles the highlighting functionality.
     * We use the scroll functionality again, some array creation and
     * manipulation, class adding and class removing, and conditional testing
     */
    var aChildren = $(".nav2-inner-container").children(); // find the a children of the list items
    var aArray = []; // create the empty aArray
    for (var i = 0; i < aChildren.length; i++) {
        var aChild = aChildren[i];
        //var ahref = $(aChild).attr('href');
        var aHash = aChild.hash;

        aArray.push(aHash);
    } // this for loop fills the aArray with attribute href values

    $(window).scroll(function () {
        var windowPos = $(window).scrollTop(); // get the offset of the window from the top of page
        var windowHeight = $(window).height(); // get the height of the window
        var docHeight = $(document).height();

        for (var i = 0; i < aArray.length; i++) {
            var theID = aArray[i];
            var divPos = $(theID).offset().top; // get the offset of the div from the top of page
            var divHeight = $(theID).height(); // get the height of the div in question
            if (windowPos >= divPos && windowPos < (divPos + divHeight)) {
                $("a[href='" + theID + "']").addClass("nav-active");
            } else {
                $("a[href='" + theID + "']").removeClass("nav-active");
            }
        }

        if (windowPos + windowHeight == docHeight) {
            if (!$("nav li:last-child a").hasClass("nav-active")) {
                var navActiveCurrent = $(".nav-active").attr("href");
                $("a[href='" + navActiveCurrent + "']").removeClass("nav-active");
                $("nav li:last-child a").addClass("nav-active");
            }
        }
    });
}





function checkSnapperAfterResize(snapper) {
    console.log("check snapper")
    
    var windowsize = $(window).width();

    windowsize = $(window).width();
    if (windowsize > 1224) {
        //if the window is greater than 440px wide then turn on jScrollPane..
        //$('#content-pane').attr('data-snap-ignore', 'true');
        snapper.disable();
        if (snapper.state().state == "left") {
            snapper.close();
        }
    } else {
        $('#content-pane').removeAttr('data-snap-ignore');
        snapper.enable();
    }
}

function highlightActiveMenuItem() {
    $('.current-page').removeClass('current-page');
    var pgurl = window.location.pathname;
    var pguri = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);

    $('nav a').each(function () {

        if ($(this).attr("href") == pgurl || $(this).attr("href") == '') { // Compare url to links
            $(this).addClass("current-page");
            $(this).parent().siblings('.nav1-title').addClass('current-page'); // Set "active" class on the parent of submenu links
        }
    });
}