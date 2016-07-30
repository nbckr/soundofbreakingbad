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
    initNavMenu();
    hideAllButCurrentPage();
    initPjax();

    //highlightActiveMenuItem(); // otherwise only at pjax:end
    setCurrentPageAndCascadeUpwards();
    setCurrentSection();
    //scrollToCurrentSection();
}

/**
 * Stuff that happens inside the pjax-container needs to be done after each load.
 */
function initCurrentPage() {
    console.log("initcurrentpage")
    initNavLinksAndToggling();
    initBackToTopScroller();
    initBigfoot();
    initAccordion();
    initNavHighlightingAndScrolling();

}

function initBigfoot() {
    var bigfoot = $.bigfoot(
        {
            actionOriginalFN: 'delete',
            footnoteTagname: 'p',
            footnoteParentClass: 'footnote',
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

/**
 * Creates the nav bar on the left and make it swipeable.
 */
function initNavMenu() {

    var menuToggleButton = $('#menu-toggle');
    var nav = $('nav');

    menuToggleButton.click(function () {

        if (nav.hasClass('off-screen')) {
            nav.removeClass('off-screen')
        } else {
            nav.addClass('off-screen');
        }

    });
}

function hideAllButCurrentPage() {

    var currentNav2Title = getCurrentNav2Title();
    var currentNav2InnerContainer = currentNav2Title.next();
    var currentNav1InnerContainer = currentNav2Title.parent().parent();
    var currentNav1OuterContainer = currentNav1InnerContainer.parent();

    $('.nav1-inner-container').hide();
    $('.nav2-inner-container').hide();

    if (!currentNav1OuterContainer.hasClass('single-parent')) {
        $(currentNav1InnerContainer).slideDown('slow');
    }
    $(currentNav2InnerContainer).show();
}

/**
 * Handles what happens when user clicks on menu level 1 and 2.
 */
function initNavLinksAndToggling() {

    $('.nav1-title').click(function (event) {

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

        event.preventDefault();
        event.stopImmediatePropagation();

        // If already current page, just scroll to top
        if ($(this).hasClass('current-page') && $(this).next().is(':visible')) {
            $('body').scrollTo(0, 400);
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

/**
 * Defines what happens when user clicks on level 3 menu items and scrolls on page.
 */
function initNavHighlightingAndScrolling() {

    console.log("initnavhigh")

    var currentNav2Title = getCurrentNav2Title();
    var currentNav3Titles;

    if (currentNav2Title && currentNav2Title.next().hasClass('nav2-inner-container')) {
        currentNav3Titles = currentNav2Title.next().children();

        var body = $('body');

        // scrolling when clicked
        currentNav3Titles.click(function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            body.scrollTo(this.hash, this.hash, {offset: -60});
        });

        // highlighting
        $(window).unbind('scroll');
        $(window).scroll(function () {

            var windowPos = body.scrollTop(); // get the offset of the window from the top of page
            var windowHeight = $(window).height(); // get the height of the window
            var docHeight = $(document).height();

            // special case for last element (might be smaller than one window height)
            if (windowPos + windowHeight == docHeight) {
                $('.nav3-title.current-section').removeClass('current-section');
                currentNav3Titles.last().before().removeClass('current-section');
                currentNav3Titles.last().addClass("current-section");
                return;
            }

            for (var i = 0; i < currentNav3Titles.length; i++) {
                var currentNav3Title = currentNav3Titles.get(i);
                var currentHash = currentNav3Title.hash;
                var currentPathname = currentNav3Title.pathname;

                var currentDivPos = $(currentHash).position().top; // get the offset of the div from the top of page

                var nextNav3Title = currentNav3Titles.get(i + 1);
                var nextDivPos = Number.POSITIVE_INFINITY;
                if (nextNav3Title) {
                    var nextHash = nextNav3Title.hash;
                    nextDivPos = $(nextHash).position().top;
                }

                if ((windowPos >= currentDivPos && windowPos < nextDivPos)) {
                    $("a[href='" + currentPathname + currentHash + "']").addClass("current-section");
                } else {
                    $("a[href='" + currentPathname + currentHash + "']").removeClass("current-section");
                }
            }
        });
    }
}

function initPjax() {
    $(document).on('pjax:end', function () {
        initCurrentPage();
    });
}

function initBackToTopScroller() {
    var windowHeight = $(window).height(); // get the height of the window
    var docHeight = $('#pjax-container').height();

    if (docHeight > 3 * windowHeight) {
        $('#back-to-top').click(function (evn) {
            evn.preventDefault();
            evn.stopImmediatePropagation();
            $('body').scrollTo(0, 400);
        });
    }
    else {
        $('#back-to-top').hide();
    }
}

function setCurrentPageAndCascadeUpwards(nav2title) {

    $('.current-page').removeClass('current-page');

    nav2title = nav2title || getCurrentNav2Title();

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

function scrollToCurrentSection(nav3title) {
    nav3title = nav3title || getCurrentNav3Title();

    // TODO!
    console.log(nav3title)
    if (nav3title) {
        $('#pjax-container').scrollTo(nav3title.children(0).hash, 0);
    }
}

function getCurrentNav2Title() {
    var pgurl = window.location.pathname;
    var currentNav2Title;
    $('.nav2-title').each(function () {

        if ($(this).attr('href') == pgurl) {
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

        if ($(this).attr('href') == href || $(this).attr('href') == '') { // Compare url to links
            navObject = $(this);
            return false;   // break loop
        }
    });
    return navObject;
}

function loadPjaxContent(nav2title) {


    var href = nav2title.attr('href');
    var nav = $('nav');
    var contentPane = $('#content-pane');

    $('body').scrollTo(0, 0);
    contentPane.hide();

    nav.addClass('off-screen');


    $.pjax({
        'url': href,
        'fragment': '#pjax-container',
        'container': '#pjax-container',
        'timeout': 1000
        //'scrollTo': 0x
    });

    contentPane.fadeIn();

}