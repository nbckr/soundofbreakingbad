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
    hideAllButCurrentPage();
    initPjax();

    //highlightActiveMenuItem(); // otherwise only at pjax:end
    setCurrentPageAndCascadeUpwards();
    setCurrentSection();
}

/**
 * Stuff that happens inside the pjax-container needs to be done after each load.
 */
function initCurrentPage() {
    //console.log("initcurrent");
    initNavLinksAndToggling();
    //initWhatever();
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
        maxPosition: 315,
        tapToClose: true,
        //    touchToDrag: true,
        slideIntent: 20
    });

    var menuToggleButton = $('#menu-toggle');
    menuToggleButton.click(function () {

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

function hideAllButCurrentPage() {

    var currentNav2Title = getCurrentNav2Title();
    var currentNav2InnerContainer = currentNav2Title.next();
    var currentNav1InnerContainer = currentNav2Title.parent().parent();
    var currentNav1OuterContainer = currentNav1InnerContainer.parent();

    console.log(currentNav2Title, currentNav2InnerContainer, currentNav1InnerContainer);

    $('.nav1-inner-container').hide();
    $('.nav2-inner-container').hide();

    if (!currentNav1OuterContainer.hasClass('single-parent')) {
        $(currentNav1InnerContainer).slideDown('slow');
    }
    $(currentNav2InnerContainer).show();
}


function initNavLinksAndToggling() {

    $('.nav1-title').click(function (event) {

        console.log("nav1-title clicked")

        event.preventDefault();
        event.stopImmediatePropagation();

        var currentNav1InnerContainer = $(this).next();
        var currentNav1OuterContainer = $(this).parent();
        var firstNav2TitleChild = currentNav1InnerContainer.children().first().children().first();

        // Toggle if has more than one child
        if (!currentNav1OuterContainer.hasClass('single-parent')) {
            currentNav1InnerContainer.slideToggle('medium');
        }

        // Hide the other panels
        $('.nav1-inner-container').not(currentNav1InnerContainer).slideUp('fast');
        $('.nav2-inner-container').not(firstNav2TitleChild.next()).slideUp('fast');

        // Load content if not already current page
        if (!$(this).hasClass('current-page')) {
            loadPjaxContent(firstNav2TitleChild);
            firstNav2TitleChild.next().slideDown('fast');
            setCurrentPageAndCascadeUpwards(firstNav2TitleChild);
        }
    });

    $('.nav2-title').click(function (event) {

        console.log("nav2-title clicked")

        event.preventDefault();
        event.stopImmediatePropagation();

        // If already current page, just scroll to top
        if ($(this).hasClass('current-page') && $(this).next().is(":visible")) {
            $('#content-pane').scrollTo(0, 400);
            return false;
        }

        // Else, expand this panel
        var nextNav2Container = $(this).next();

        if (nextNav2Container.hasClass('nav2-inner-container')) {
            nextNav2Container.slideDown('fast');
        }

        // Hide the other panels
        $('.nav2-inner-container').not(nextNav2Container).slideUp('fast');

        // load content-pane
        loadPjaxContent($(this));
        setCurrentPageAndCascadeUpwards($(this));
    });
}

function initPjax() {

    $(document).on('pjax:end', function () {
        //console.log("pjax:end")
        initCurrentPage();
    });
}

function initScrollTo() {

    //console.log("init scrollto")

    var currentNav2Title = getCurrentNav2Title();
    var currentNav3Titles;

    if (currentNav2Title && currentNav2Title.next().hasClass('nav2-inner-container')) {
        currentNav3Titles = currentNav2Title.next().children();

        // scrolling
        currentNav3Titles.click(function (event) {
            //console.log("click should scroll");
            event.preventDefault();
            event.stopImmediatePropagation();
            $('#content-pane').scrollTo(this.hash, this.hash);
        });

        //console.log(currentNav2Title)
        //console.log(currentNav3Titles)

        $('#content-pane').unbind('scroll');
        $('#content-pane').scroll(function () {
            //console.log("SCROLLING like a bitch")

            //if (!currentNav3Titles) {
            //    return false;
            //}

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


function setCurrentPageAndCascadeUpwards(nav2title) {

    $('.current-page').removeClass('current-page');

    nav2title = nav2title || getCurrentNav2Title();

    console.log(nav2title);

    nav2title.addClass('current-page');                     // nav2-title
    nav2title.next().addClass('current-page');              // nav2-inner-container
    nav2title.parent().addClass('current-page');            // nav2-outer-container

    var nav1Title = nav2title.parent().parent().prev();
    nav1Title.addClass('current-page');                     // nav1-title
    nav1Title.next().addClass('current-page');              // nav1-inner-container
    nav1Title.parent().addClass('current-page');            // nav1-outer-container
}

function setCurrentSection(nav3title) {
    nav3title = nav3title || getCurrentNav3Title();

    if (nav3title) {
        nav3title.addClass('current-section');
    }
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

function getCurrentNav3Title() {
    if (!window.location.hash) {
        return false;
    }

    var href = window.location.pathname + window.location.hash;
    return getNavObjectByHref(href);
}


function getNavObjectByHref(href) {
    var navObject;

    $('nav a').each(function () {

        if ($(this).attr("href") == href || $(this).attr("href") == '') { // Compare url to links
            navObject = $(this);
            return false;   // break loop
        }
    });
    return navObject;
}

function loadPjaxContent(nav2title) {

    var href = nav2title.attr("href");

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
