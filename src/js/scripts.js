/* All the stuff that needs to happen every time a page is accessed directly or the pjax-container is loaded. */

var $window;
var $body;
var $document;
var $nav;
var $loadingIndicator;
var $contentPane;
var $pjaxContainer;
var $nav1InnerContainers;
var $nav2InnerContainers;
var $nav1Titles;
var $nav2Titles;
var $nav3Titles;
var $allLinksInNav; // nav2title and nav3title

$(function () {
    initOnlyOnDirectAccess();
    initCurrentPage();
});

/**
 * Stores jQuery references to objects that are independent from current content-pane.
 */
function collectGlobalVariables() {
    $window = $(window);
    $body = $('body');
    $document = $(document);
    $nav = $('nav');
    $loadingIndicator = $('#loading-indicator');
    $contentPane = $('#content-pane');
    $pjaxContainer = $('#pjax-container');
    $nav1InnerContainers = $('.nav1-inner-container');
    $nav2InnerContainers = $('.nav2-inner-container');
    $nav1Titles = $('.nav1-title');
    $nav2Titles = $('.nav2-title');
    $nav3Titles = $('.nav3-title');
    $allLinksInNav = $('nav a');
}

/**
 * Stuff that happens in other elements than pjax-container needs to happen only once.
 */
function initOnlyOnDirectAccess() {
    collectGlobalVariables();
    initPjax();
    initNavToggleButton();
    initClickOnPageTitle();
    collapseAllButCurrentNavItem();
    setCurrentPageAndCascadeUpwards();
    setCurrentSection();
    scrollToCurrentSection();
}

/**
 * Stuff that happens inside the pjax-container needs to be done after each load.
 */
function initCurrentPage() {
    initNavLinksAndToggling();
    initNavHighlightingAndScrolling();
    hideNavWhenClickOnContentPane();
    initBigfoot();
    initAccordion();
    initIndexSectionsLinks();
    initTopArrowButton();
    initLeftRightArrowButtons();
}

function initBigfoot() {
    $.bigfoot(
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
    $('.accordion').accordion({
        duration: 400,
        exclusive: false
    });
}

function initNavToggleButton() {
    var navToggleButton = $('#nav-toggle');
    var nav = $('nav');

    navToggleButton.on('click', function () {
        if (nav.hasClass('off-screen')) {
            nav.removeClass('off-screen')
        } else {
            nav.addClass('off-screen');
        }
    });
}


function collapseAllNav1InnerContainers(animate) {
    if (animate) {
        $nav1InnerContainers.slideUp();
    } else {
        $nav1InnerContainers.hide();
    }
}

function collapseAllNav2InnerContainers(animate) {
    if (animate) {
        $nav2InnerContainers.slideUp();
    } else {
        $nav2InnerContainers.hide();
    }
}

function expandCurrentNav1InnerContainer(animate) {
    var currentNav2Title = getCurrentNav2Title();
    if (!currentNav2Title) {
        return false;
    }

    var currentNav1InnerContainer = currentNav2Title.parent().parent();
    var currentNav1OuterContainer = currentNav1InnerContainer.parent();

    if (!currentNav1OuterContainer.hasClass('single-parent')) {
        if (animate) {
            $(currentNav1InnerContainer).slideDown('medium');
        } else {
            $(currentNav1InnerContainer).show();
        }
    }
}

function expandCurrentNav2InnerContainer(animate) {
    var currentNav2Title = getCurrentNav2Title();
    if (!currentNav2Title) {
        return false;
    }

    var currentNav2InnerContainer = currentNav2Title.next();

    if (animate) {
        $(currentNav2InnerContainer).slideDown('medium');
    } else {
        $(currentNav2InnerContainer).show();
    }
}

function collapseAllButCurrentNavItem(animate) {
    collapseAllNav1InnerContainers(animate);
    collapseAllNav2InnerContainers(animate);
    expandCurrentNav1InnerContainer(animate);
    expandCurrentNav2InnerContainer(animate);
}

/**
 * Handles what happens when user clicks on menu level 1 and 2.
 */
function initNavLinksAndToggling() {

    $nav1Titles.on('click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        // TODO use extracted method
        var currentNav1InnerContainer = $(this).next();
        var currentNav1OuterContainer = $(this).parent();
        var firstNav2TitleChild = currentNav1InnerContainer.children().first().children().first();

        // Toggle if has more than one child
        if (!currentNav1OuterContainer.hasClass('single-parent')) {
            currentNav1InnerContainer.slideToggle('medium');
        }

        // Hide the other panels
        $nav1InnerContainers.not(currentNav1InnerContainer).slideUp('fast');
        $nav2InnerContainers.not(firstNav2TitleChild.next()).slideUp('fast');

        // Load content if not already current page
        if (!$(this).hasClass('current-page')) {
            loadPjaxContent(firstNav2TitleChild.attr('href'));
            firstNav2TitleChild.next().slideDown('fast');
            setCurrentPageAndCascadeUpwards(firstNav2TitleChild);
        }
    });

    $nav2Titles.on('click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        // If already current page, just scroll to top
        if ($(this).hasClass('current-page') && $(this).next().is(':visible')) {
            $body.scrollTo(0, 400);
            return false;
        }

        // Else, expand this panel
        var nextNav2Container = $(this).next();

        if (nextNav2Container.hasClass('nav2-inner-container')) {
            nextNav2Container.slideDown('fast');
        }

        // Hide the other panels
        $nav2InnerContainers.not(nextNav2Container).slideUp('fast');

        // load content-pane
        loadPjaxContent($(this).attr('href'));
        setCurrentPageAndCascadeUpwards($(this), false);
    });
}

/**
 * Defines what happens when user clicks on level 3 menu items and scrolls on page.
 */
function initNavHighlightingAndScrolling() {

    var currentNav2Title = getCurrentNav2Title();
    if (!currentNav2Title) {
        return false;
    }
    var currentNav1OuterContainer = currentNav2Title.parents('.nav1-outer-container');
    var currentNav3Titles;

    // always unbind scroll highlighting function from last content-pane
    $window.unbind('scroll');

    if (!currentNav1OuterContainer.hasClass('single-parent')) {
        currentNav3Titles = currentNav2Title.next().children();

        // scrolling when clicked
        currentNav3Titles.on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            scrollToCurrentSection($(this))
        });

        // highlighting
        $window.scroll(function () {
            var windowPos = $body.scrollTop(); // get the offset of the window from the top of page
            var windowHeight = $window.height(); // get the height of the window
            var docHeight = $document.height();

            // special case for last element (might be smaller than one window height)
            if (windowPos + windowHeight == docHeight) {
                $nav3Titles.filter('.current-section').removeClass('current-section');
                currentNav3Titles.last().before().removeClass('current-section');
                currentNav3Titles.last().addClass("current-section");
                return false;
            }

            for (var i = 0; i < currentNav3Titles.length; i++) {
                var currentNav3Title = currentNav3Titles.get(i);
                var currentPathname = currentNav3Title.pathname;
                var currentHash = currentNav3Title.hash;

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

function initIndexSectionsLinks() {
    $('#index-sections').find('a').on('click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        loadPjaxContent($(this).attr('href'));
        setCurrentPageAndCascadeUpwards();
        collapseAllButCurrentNavItem(true);
    });
}


/**
 * Shows back to top scroller if page is high enough and makes it scroll to top.
 */
function initTopArrowButton() {
    var windowHeight = $window.height(); // get the height of the window
    var docHeight = $pjaxContainer.height();
    var $backToTopButton = $('#back-to-top');

    if (docHeight > 3 * windowHeight) {
        $backToTopButton.on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            $body.scrollTo(0, 400);
        });
    }
    else {
        $backToTopButton.hide();
    }
}


function initLeftRightArrowButtons() {
    $('#next-page, #last-page').each(function () {

        var currentButton = $(this);
        var href = currentButton.attr('href');

        if (href === '') {
            currentButton.remove();
        }
        else if (href === '#') {
            currentButton.addClass('disabled');
            currentButton.on('click', function () {
                event.preventDefault();
                event.stopImmediatePropagation();
            });
        }
        else {
            currentButton.on('click', function () {
                event.preventDefault();
                event.stopImmediatePropagation();

                var switchedChapter = hrefLeadsToDifferentChapter(href);

                collapseAllNav2InnerContainers(true);
                if (switchedChapter) {
                    collapseAllNav1InnerContainers(true);
                }

                loadPjaxContent(href);
                setCurrentPageAndCascadeUpwards();
                setCurrentSection();

                expandCurrentNav2InnerContainer(true);
                if (switchedChapter) {
                    expandCurrentNav1InnerContainer(true);
                }

            });
        }
    });
}

function initClickOnPageTitle() {
    $('#page-name-and-logo-link-wrapper').on('click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        loadPjaxContent($(this).attr('href'));
        setCurrentPageAndCascadeUpwards();
        collapseAllButCurrentNavItem(true);
    });
}

function hideNavWhenClickOnContentPane() {
    $contentPane.on('click', function (event) {
        if ($(event.target).closest('nav').not('.off-screen').length === 0) {
            $nav.addClass('off-screen');
        }
    });
}

function initPjax() {
    $document.on('pjax:start', function () {
        $pjaxContainer.hide();
        $body.scrollTo(0, 0);
    });

    // only XHR request, not cached data
    $document.on('pjax:send', function () {
        $loadingIndicator.addClass('block-fix');
        $loadingIndicator.show();
    });

    $document.on('pjax:end', function () {
        initCurrentPage();
        $loadingIndicator.hide();
        $loadingIndicator.removeClass('block-fix');

        $pjaxContainer.fadeIn();
    });
}

function setCurrentPageAndCascadeUpwards(nav2title) {

    $('.current-page').removeClass('current-page');

    nav2title = nav2title || getCurrentNav2Title();
    if (!nav2title) {
        return false;
    }

    nav2title.addClass('current-page');                     // nav2-title
    nav2title.next().addClass('current-page');              // nav2-inner-container
    nav2title.parent().addClass('current-page');            // nav2-outer-container

    var nav1Title = nav2title.parent().parent().prev();
    nav1Title.addClass('current-page');                     // nav1-title
    nav1Title.next().addClass('current-page');              // nav1-inner-container
    nav1Title.parent().addClass('current-page');            // nav1-outer-container
}

function setCurrentSection(nav3title) {

    $('.current-section').removeClass('current-section');

    nav3title = nav3title || getCurrentNav3Title();

    if (nav3title) {
        nav3title.addClass('current-section');
    }
}

function scrollToCurrentSection(nav3title) {
    nav3title = nav3title || getCurrentNav3Title();

    if (nav3title) {
        $body.scrollTo(nav3title.prop('hash'), nav3title.prop('hash'), {offset: -70});
    }
}

function getCurrentNav2Title() {
    var pageUrl = window.location.pathname;
    var currentNav2Title;
    $nav2Titles.each(function () {

        if ($(this).attr('href') == pageUrl) {
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

    $allLinksInNav.each(function () {

        if ($(this).attr('href') == href || $(this).attr('href') == '') {
            navObject = $(this);
            return false;   // break loop
        }
    });
    return navObject;
}

function loadPjaxContent(href) {
    $nav.addClass('off-screen');

    $.pjax({
        'url': href,
        'fragment': '#pjax-container',
        'container': '#pjax-container',
        'timeout': 8000     // mobile connection might take some time
    });
}

function hrefLeadsToDifferentChapter(href) {
    var currentLocation = window.location.pathname;
    var currentChapter = currentLocation.split('/')[2];

    var newChapter = href.split('/')[2];
    return currentChapter != newChapter;
}