/* All the stuff that needs to happen every time a page is accessed directly or the pjax-container is loaded. */

//$(document).ready(function($) {
$(function () {
    //console.log("doc ready!")
    initOnlyOnDirectAccess();
    initCurrentPage();
});

/**
 * Stuff that happens in other elements than pjax-container needs to happen only once.
 */
function initOnlyOnDirectAccess() {
    // //console.log("initDirect");

    initNavBase();
    initNavToggling();
    initPjax();
    highlightActiveMenuItem(); // otherwise only at pjax:end

}

/**
 * Stuff that happens inside the pjax-container needs to be done after each load.
 */
function initCurrentPage() {
    //console.log("initcurrent");

    initWhatever();
    initScrollTo();
    initBackToTopScroller();
    initBigfoot();
    initAccordion();

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
    //    //console.log("heyYyXXXX");
//
    //    var $this = $(this);
    //    var request = $this.data('dest') + '.html';
    //    var spinner = '<div class="loader">Loading!</div>';
    //    $('#content-pane').html(spinner).load(request);
    //    $('#content-pane').show();
    //})
}

function initNavBase() {

    var snapper = new Snap({
        element: document.getElementById('content-pane')
    });

    checkSnapperAfterResize(snapper);

    snapper.settings({
        disable: 'right',
        //    addBodyClasses: true,
        hyperextensible: false,
        //    resistance: 0.5,
        //    flickThreshold: 50,
        //    transitionSpeed: 0.3,
        //    easing: 'ease',
        maxPosition: 300,
        tapToClose: true,
        //    touchToDrag: true,
        slideIntent: 20
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
}

function initNavToggling() {

    // TODO initially hide nav parts except currently active
    var pgurl = window.location.pathname;
    var currentNav2Title;
    var currentNav2InnerContainer;
    var currentNav1InnerContainer;

    $('.nav2-title').each(function () {
        if ($(this).attr("href") == pgurl) {
            currentNav2Title = $(this);
            currentNav2InnerContainer = currentNav2Title.next();
            currentNav1InnerContainer = currentNav2Title.parent();
            return false; // break loop
        }
    });
    $('.nav1-inner-container').not(currentNav1InnerContainer).hide();
    $('.nav2-inner-container').not(currentNav2InnerContainer).hide();

    // toggle effect for nav1
    $('.nav1-title').click(function () {

        //Expand or collapse this panel
        var currentNav1InnerContainer = $(this).next().children();
        if (currentNav1InnerContainer.length > 1) {
            $(this).next().slideToggle('medium');
            // TODO always load 1st child
        }

        else if (!$(this).hasClass('current-page')) {
            console.log("HI!")

            var onlyNav2Child = $(this).next();

            loadPjaxContent(onlyNav2Child.attr('href'));
            setCurrentPageAndCascadeUpwards(onlyNav2Child);
        }

        //Hide the other panels
        $('.nav1-inner-container').not($(this).next()).slideUp('fast');
        $('.nav2-inner-container').slideUp('fast');
    });

    // toggle effect and PJAX loading for nav2
    $('.nav2-title').click(function (event) {

        event.preventDefault();
        event.stopImmediatePropagation();

        if ($(this).hasClass('current-page') && $(this).next().is(":visible")) {
            $('#content-pane').scrollTo(0, 400);
            return;
        }


        //Expand or collapse this panel
        var nextNav2Container = $(this).next();

        if (nextNav2Container.hasClass('nav2-inner-container')) {
            nextNav2Container.slideToggle('fast');
        }

        //Hide the other panels
        $('.nav2-inner-container').not(nextNav2Container).slideUp('fast');

        // load content-pane
        loadPjaxContent($(this).attr("href"));
    });
}

function initPjax() {

    $(document).on('pjax:end', function () {
        //console.log("pjax:end")
        initCurrentPage();
        highlightActiveMenuItem();


    });
}

function initScrollTo() {

    //console.log("init scrollto")

    var currentNav2Title = getCurrentNav2Title();
    var currentNav3Titles;
    var currentNav3Hashes = [];

    // TODO what if there is no nav2 here
    if (currentNav2Title && currentNav2Title.next().hasClass('nav2-inner-container')) {
        currentNav3Titles = currentNav2Title.next().children();

        // scrolling
        currentNav3Titles.click(function (event) {
            //console.log("click should scroll");
            event.preventDefault();
            event.stopImmediatePropagation();
            $('#content-pane').scrollTo(this.hash, this.hash);
        });

        // collect hashes for highlighting
        for (var i = 0; i < currentNav3Titles.length; i++) {
            currentNav3Hashes.push(currentNav3Titles.get(i).hash);
        }
    }

    //console.log(currentNav2Title)
    //console.log(currentNav3Titles)
    //console.log(currentNav3Hashes)


    $('#content-pane').unbind('scroll');
    $('#content-pane').scroll(function () {
        //console.log("SCROLLING like a bitch")

        if (!currentNav3Titles) {
            return false;
        }

        var windowPos = $('#content-pane').scrollTop(); // get the offset of the window from the top of page
        var windowHeight = $('#content-pane').height(); // get the height of the window
        var docHeight = $(document).height();

        ////console.log("pos: " + windowPos + " height: " + windowHeight);
        //console.log(currentNav3Titles);

        for (var i = 0; i < currentNav3Titles.length; i++) {
            var currentNav3Title = currentNav3Titles.get(i);
            var currentHash = currentNav3Title.hash;
            var currentPathname = currentNav3Title.pathname;

            var nextNav3Title = currentNav3Titles.get(i + 1);

            var currentDivPos = $(currentHash).position().top; // get the offset of the div from the top of page
            var nextDivPos;
            if (nextNav3Title) {
                var nextHash = nextNav3Title.hash;
                nextDivPos = $(nextHash).position().top;
            } else {
                nextDivPos = 99999999999999999;
            }

            if ((windowPos >= currentDivPos && windowPos < nextDivPos)
                || !nextDivPos) {
                $("a[href='" + currentPathname + currentHash + "']").addClass("current-section");
            } else {
                $("a[href='" + currentPathname + currentHash + "']").removeClass("current-section");
            }
        }

        // TODO wtf?
        if (windowPos + windowHeight == docHeight) {
            if (!$("nav li:last-child a").hasClass("current-section")) {
                var navActiveCurrent = $(".current-section").attr("href");
                $("a[href='" + navActiveCurrent + "']").removeClass("current-section");
                $("nav li:last-child a").addClass("current-section");
            }
        }
    });
}

function initBackToTopScroller() {
    var windowHeight = $(window).height(); // get the height of the window
    var docHeight = $('#pjax-container').height();
    //console.log("init backtotop; window: " + windowHeight + ", doc: " + docHeight)

    if (docHeight > 3 * windowHeight) {
        $("#back-to-top").click(function (evn) {
            evn.preventDefault();
            evn.stopImmediatePropagation();
            $('#content-pane').scrollTo(0, 400);
        });
    }
    else {
        $('#back-to-top').hide();
    }
}


function checkSnapperAfterResize(snapper) {
    //console.log("check snapper")

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

    //var currentNav2Title = getCurrentNav2Title();
    //currentNav2Title.addClass('current-page');
    //currentNav2Title.parent().siblings('.nav1-title').addClass('current-page'); // Set "active" class on the parent of submenu links

    var pgurl = window.location.pathname;

    $('nav a').each(function () {

        if ($(this).attr("href") == pgurl || $(this).attr("href") == '') { // Compare url to links
            $(this).addClass("current-page");
            $(this).parent().siblings('.nav2-title').addClass('current-page'); // nav2-title
            $(this).parent().addClass('current-page'); // nav2-outer-container
            $(this).parent().parent().siblings('.nav1-title').addClass('current-page'); // nav1-title
            $(this).parent().parent().parent().addClass('current-page'); // nav1-outer-container
        }
    });
}

function setCurrentPageAndCascadeUpwards(nav2Title) {
    nav2Title.addClass('current-page'); // nav2-title
    nav2Title.next().addClass('current-page'); // nav2-inner-container
    nav2Title.parent().addClass('current-page'); // nav2-outer-container
    nav2Title.parent().prev().addClass('current-page'); // nav1-title
    nav2Title.parent().addClass('current-page'); // nav1-inner-container
    nav2Title.parent().parent().addClass('current-page'); // nav1-outer-container
}

function getCurrentNav2Title() {
    var pgurl = window.location.pathname;
    var currentNav2Title;
    $('.nav2-title').each(function () {

        ////console.log($(this).attr("href"));
        ////console.log(pgurl);

        if ($(this).attr("href") == pgurl) {
            currentNav2Title = $(this);
            return false; // break loop
        }
    });
    return currentNav2Title;
}

function loadPjaxContent(href) {

    $('#content-pane').scrollTo(0, 0);
    $('#content-pane').hide();

    $.pjax({
        "url": href,
        "fragment": "#pjax-container",
        "container": "#pjax-container",
        "timeout": 1000,
        "scrollTo": 0
    });

    $('#content-pane').fadeIn();
}
