/*
=========================================================
    KAMOTAS CHAPATI
    MAIN SPA ROUTER
=========================================================
*/

import {
    initMenuPage,
    cleanupMenuPage
} from "./menu.js";

import {
    initOrderSystem,
    cleanupOrderSystem
} from "./order.js";


/* ======================================================
   PAGE CONFIGURATION
====================================================== */

const PAGES = {

    home: {
        file: "./pages/home.html",
        css: "./css/home.css",
        title: "Kamotas Chapati | Fresh Food Restaurant"
    },

    about: {
        file: "./pages/about.html",
        css: "./css/about.css",
        title: "About | Kamotas Chapati"
    },

    menu: {
        file: "./pages/menu.html",
        css: "./css/menu.css",
        title: "Menu | Kamotas Chapati"
    },

    gallery: {
        file: "./pages/gallery.html",
        css: "./css/gallery.css",
        title: "Gallery | Kamotas Chapati"
    },

    contact: {
        file: "./pages/contact.html",
        css: "./css/contact.css",
        title: "Contact | Kamotas Chapati"
    }

};


/* ======================================================
   GREETING MESSAGES
====================================================== */

const PAGE_GREETING_MESSAGES = {

    home: "Welcome to Kamotas",

    about: "Welcome to our story",

    menu: "What are you craving?",

    gallery: "Welcome to our moments",

    contact: "We're happy to hear from you"

};


/* ======================================================
   APPLICATION STATE
====================================================== */

let currentPage = null;

let activePageStylesheet = null;

let galleryCleanup = null;

let menuPageCleanup = null;

let orderSystemCleanup = null;

let navigationInitialized = false;


/* ======================================================
   DOM REFERENCES
====================================================== */

const app =
    document.getElementById("app");

const navLinksContainer =
    document.getElementById("nav-links");

const menuToggle =
    document.getElementById("menu-toggle");

const navOrderButton =
    document.querySelector(".nav-order-btn");

const brandLink =
    document.querySelector(".brand");


/* ======================================================
   FOOTER YEAR
====================================================== */

function updateFooterYear() {

    const yearElement =
        document.getElementById("footer-year");

    if (!yearElement) {
        return;
    }

    yearElement.textContent =
        new Date().getFullYear();

}


/* ======================================================
   TIME BASED GREETING
====================================================== */

function getGreetingByTime() {

    const hour =
        new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return "Good Morning";
    }

    if (hour >= 12 && hour < 17) {
        return "Good Afternoon";
    }

    return "Good Evening";
}


function updatePageGreetings(pageName) {

    const greetingElements =
        document.querySelectorAll(
            "[data-greeting]"
        );

    if (!greetingElements.length) {
        return;
    }

    const timeGreeting =
        getGreetingByTime();

    const pageMessage =
        PAGE_GREETING_MESSAGES[pageName] ||
        "Welcome to Kamotas";

    greetingElements.forEach((element) => {

        element.innerHTML = `
            <span class="greeting-time">
                ${timeGreeting}
            </span>

            <span class="greeting-divider">
                •
            </span>

            <span class="greeting-message">
                ${pageMessage}
            </span>
        `;

    });

}


/* ======================================================
   PAGE CSS LOADER
====================================================== */

function loadPageStylesheet(href) {

    return new Promise((resolve, reject) => {

        if (
            activePageStylesheet &&
            activePageStylesheet.getAttribute("href") === href
        ) {
            resolve(activePageStylesheet);
            return;
        }


        const stylesheet =
            document.createElement("link");

        stylesheet.rel = "stylesheet";

        stylesheet.href = href;

        stylesheet.dataset.pageStylesheet = "true";


        stylesheet.onload = () => {

            if (activePageStylesheet) {

                activePageStylesheet.remove();

            }

            activePageStylesheet =
                stylesheet;

            resolve(stylesheet);

        };


        stylesheet.onerror = () => {

            stylesheet.remove();

            reject(
                new Error(
                    `Failed to load page stylesheet: ${href}`
                )
            );

        };


        document.head.appendChild(
            stylesheet
        );

    });

}


/* ======================================================
   LOADING STATE
====================================================== */

function showLoadingState() {

    if (!app) {
        return;
    }

    app.innerHTML = `
        <section class="page-loading">

            <div class="loading-spinner"></div>

            <p>
                Loading Kamotas...
            </p>

        </section>
    `;

}


/* ======================================================
   ERROR STATE
====================================================== */

function showPageError(pageName, error) {

    console.error(
        `Kamotas page error [${pageName}]:`,
        error
    );


    if (!app) {
        return;
    }


    app.innerHTML = `
        <section class="page-error">

            <div class="page-error-icon">
                <i class="fa-solid fa-triangle-exclamation"></i>
            </div>

            <span class="section-kicker">
                SOMETHING WENT WRONG
            </span>

            <h1>
                We couldn't load this page.
            </h1>

            <p>
                Please try again. If the problem continues,
                return to the home page.
            </p>

            <div class="page-error-actions">

                <button
                    type="button"
                    class="btn"
                    id="retryPageButton"
                >
                    <i class="fa-solid fa-rotate-right"></i>
                    <span>Try Again</span>
                </button>

                <a
                    href="#home"
                    data-page="home"
                    class="page-error-home"
                >
                    Back Home
                </a>

            </div>

        </section>
    `;


    const retryButton =
        document.getElementById(
            "retryPageButton"
        );


    if (retryButton) {

        retryButton.addEventListener(
            "click",
            () => {
                loadPage(
                    pageName,
                    true
                );
            },
            {
                once: true
            }
        );

    }

}


/* ======================================================
   CLEAN CURRENT PAGE
====================================================== */

function cleanupCurrentPage() {

    /*
    ------------------------------------------------------
    ORDER SYSTEM
    ------------------------------------------------------
    */

    if (typeof orderSystemCleanup === "function") {

        try {

            orderSystemCleanup();

        } catch (error) {

            console.error(
                "Order cleanup failed:",
                error
            );

        }

    }

    orderSystemCleanup = null;


    /*
    ------------------------------------------------------
    MENU SYSTEM
    ------------------------------------------------------
    */

    if (typeof menuPageCleanup === "function") {

        try {

            menuPageCleanup();

        } catch (error) {

            console.error(
                "Menu cleanup failed:",
                error
            );

        }

    }

    menuPageCleanup = null;


    /*
    ------------------------------------------------------
    GALLERY SYSTEM
    ------------------------------------------------------
    */

    if (typeof galleryCleanup === "function") {

        try {

            galleryCleanup();

        } catch (error) {

            console.error(
                "Gallery cleanup failed:",
                error
            );

        }

    }

    galleryCleanup = null;


    /*
    ------------------------------------------------------
    BODY STATES
    ------------------------------------------------------
    */

    document.body.classList.remove(
        "checkout-open"
    );

    document.body.classList.remove(
        "menu-page-active"
    );

    document.body.classList.remove(
        "gallery-lightbox-open"
    );

}


/* ======================================================
   GALLERY INITIALIZER
====================================================== */

function initializeGalleryPage() {

    const galleryPage =
        document.getElementById(
            "galleryPage"
        );

    if (!galleryPage) {
        return null;
    }


    const lightbox =
        document.getElementById(
            "galleryLightbox"
        );

    const lightboxImage =
        document.getElementById(
            "galleryLightboxImage"
        );

    const lightboxCaption =
        document.getElementById(
            "galleryLightboxCaption"
        );

    const closeButton =
        document.getElementById(
            "galleryLightboxClose"
        );

    const previousButton =
        document.getElementById(
            "galleryLightboxPrev"
        );

    const nextButton =
        document.getElementById(
            "galleryLightboxNext"
        );


    const galleryItems =
        Array.from(
            galleryPage.querySelectorAll(
                "[data-gallery-image]"
            )
        );


    if (
        !lightbox ||
        !lightboxImage ||
        !lightboxCaption ||
        !galleryItems.length
    ) {

        return null;

    }


    let currentIndex = 0;


    function openGallery(index) {

        if (!galleryItems[index]) {
            return;
        }


        currentIndex = index;


        const item =
            galleryItems[currentIndex];

        const image =
            item.dataset.galleryImage;

        const title =
            item.dataset.galleryTitle ||
            "";


        lightboxImage.src = image;

        lightboxImage.alt = title;

        lightboxCaption.textContent =
            title;


        lightbox.classList.add(
            "open"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "gallery-lightbox-open"
        );

    }


    function closeGallery() {

        lightbox.classList.remove(
            "open"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "gallery-lightbox-open"
        );


        setTimeout(() => {

            if (
                !lightbox.classList.contains(
                    "open"
                )
            ) {

                lightboxImage.src = "";

                lightboxCaption.textContent =
                    "";

            }

        }, 250);

    }


    function showPrevious() {

        if (!galleryItems.length) {
            return;
        }


        currentIndex =
            (
                currentIndex -
                1 +
                galleryItems.length
            ) %
            galleryItems.length;


        openGallery(
            currentIndex
        );

    }


    function showNext() {

        if (!galleryItems.length) {
            return;
        }


        currentIndex =
            (
                currentIndex +
                1
            ) %
            galleryItems.length;


        openGallery(
            currentIndex
        );

    }


    const itemHandlers = [];


    galleryItems.forEach(
        (item, index) => {

            const handler =
                () => {
                    openGallery(index);
                };


            item.addEventListener(
                "click",
                handler
            );


            itemHandlers.push({
                item,
                handler
            });

        }
    );


    const closeHandler =
        () => {
            closeGallery();
        };


    const previousHandler =
        () => {
            showPrevious();
        };


    const nextHandler =
        () => {
            showNext();
        };


    const keydownHandler =
        (event) => {

            if (
                !lightbox.classList.contains(
                    "open"
                )
            ) {
                return;
            }


            if (
                event.key === "Escape"
            ) {

                closeGallery();

                return;

            }


            if (
                event.key === "ArrowLeft"
            ) {

                showPrevious();

                return;

            }


            if (
                event.key === "ArrowRight"
            ) {

                showNext();

            }

        };


    closeButton?.addEventListener(
        "click",
        closeHandler
    );


    previousButton?.addEventListener(
        "click",
        previousHandler
    );


    nextButton?.addEventListener(
        "click",
        nextHandler
    );


    lightbox
        .querySelectorAll(
            "[data-gallery-close]"
        )
        .forEach((element) => {

            element.addEventListener(
                "click",
                closeHandler
            );

        });


    document.addEventListener(
        "keydown",
        keydownHandler
    );


    return function cleanupGalleryPage() {

        itemHandlers.forEach(
            ({ item, handler }) => {

                item.removeEventListener(
                    "click",
                    handler
                );

            }
        );


        closeButton?.removeEventListener(
            "click",
            closeHandler
        );


        previousButton?.removeEventListener(
            "click",
            previousHandler
        );


        nextButton?.removeEventListener(
            "click",
            nextHandler
        );


        lightbox
            .querySelectorAll(
                "[data-gallery-close]"
            )
            .forEach((element) => {

                element.removeEventListener(
                    "click",
                    closeHandler
                );

            });


        document.removeEventListener(
            "keydown",
            keydownHandler
        );


        closeGallery();

    };

}


/* ======================================================
   INITIALIZE CURRENT PAGE
====================================================== */

function initializePage(pageName) {

    /*
    ------------------------------------------------------
    MENU
    ------------------------------------------------------
    */

    if (pageName === "menu") {

        try {

            menuPageCleanup =
                initMenuPage();

        } catch (error) {

            console.error(
                "Menu initialization failed:",
                error
            );

            menuPageCleanup = null;

        }


        try {

            orderSystemCleanup =
                initOrderSystem();

        } catch (error) {

            console.error(
                "Order system initialization failed:",
                error
            );

            orderSystemCleanup = null;

        }

    }


    /*
    ------------------------------------------------------
    GALLERY
    ------------------------------------------------------
    */

    if (pageName === "gallery") {

        try {

            galleryCleanup =
                initializeGalleryPage();

        } catch (error) {

            console.error(
                "Gallery initialization failed:",
                error
            );

            galleryCleanup = null;

        }

    }


    /*
    ------------------------------------------------------
    HOME / ABOUT / CONTACT
    ------------------------------------------------------
    */

    if (pageName === "home") {

        document.body.classList.add(
            "home-page-active"
        );

    }


    if (pageName === "about") {

        document.body.classList.add(
            "about-page-active"
        );

    }


    if (pageName === "contact") {

        document.body.classList.add(
            "contact-page-active"
        );

    }

}


/* ======================================================
   ACTIVE NAVIGATION
====================================================== */

function updateActiveNavigation(pageName) {

    const allPageLinks =
        document.querySelectorAll(
            "[data-page]"
        );


    allPageLinks.forEach(
        (link) => {

            const linkPage =
                link.dataset.page;


            const isActive =
                linkPage === pageName;


            if (
                link.matches(
                    ".nav-links a"
                )
            ) {

                link.classList.toggle(
                    "active",
                    isActive
                );

                if (isActive) {

                    link.setAttribute(
                        "aria-current",
                        "page"
                    );

                } else {

                    link.removeAttribute(
                        "aria-current"
                    );

                }

            }

        }
    );

}


/* ======================================================
   MOBILE NAV
====================================================== */

function closeMobileNavigation() {

    if (!navLinksContainer) {
        return;
    }


    navLinksContainer.classList.remove(
        "open"
    );


    menuToggle?.classList.remove(
        "active"
    );


    menuToggle?.setAttribute(
        "aria-expanded",
        "false"
    );


    document.body.classList.remove(
        "nav-open"
    );

}


function toggleMobileNavigation() {

    if (!navLinksContainer) {
        return;
    }


    const isOpen =
        navLinksContainer.classList.contains(
            "open"
        );


    navLinksContainer.classList.toggle(
        "open",
        !isOpen
    );


    menuToggle?.classList.toggle(
        "active",
        !isOpen
    );


    menuToggle?.setAttribute(
        "aria-expanded",
        String(!isOpen)
    );


    document.body.classList.toggle(
        "nav-open",
        !isOpen
    );

}


/* ======================================================
   GLOBAL NAVIGATION
====================================================== */

function navigate(pageName) {

    const page =
        PAGES[pageName]
            ? pageName
            : "home";


    if (
        window.location.hash !==
        `#${page}`
    ) {

        window.location.hash =
            page;

        return;

    }


    loadPage(page);

}


/* ======================================================
   LOAD PAGE
====================================================== */

async function loadPage(
    pageName,
    forceReload = false
) {

    const page =
        PAGES[pageName]
            ? pageName
            : "home";


    if (
        !forceReload &&
        currentPage === page
    ) {

        updateActiveNavigation(
            page
        );

        updatePageGreetings(
            page
        );

        return;

    }


    cleanupCurrentPage();


    showLoadingState();


    try {

        await loadPageStylesheet(
            PAGES[page].css
        );


        const response =
            await fetch(
                PAGES[page].file,
                {
                    cache: "no-cache"
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const html =
            await response.text();


        if (!html.trim()) {

            throw new Error(
                "Page file is empty."
            );

        }


        app.innerHTML =
            html;


        currentPage =
            page;


        document.title =
            PAGES[page].title;


        updatePageGreetings(
            page
        );


        updateActiveNavigation(
            page
        );


        initializePage(
            page
        );


        updateFooterYear();


        closeMobileNavigation();


        window.scrollTo({
            top: 0,
            behavior: "auto"
        });


    } catch (error) {

        currentPage = null;

        showPageError(
            page,
            error
        );

    }

}


/* ======================================================
   HASH ROUTER
====================================================== */

function getPageFromHash() {

    const hash =
        window.location.hash
            .replace(
                "#",
                ""
            )
            .trim()
            .toLowerCase();


    if (
        hash &&
        PAGES[hash]
    ) {

        return hash;

    }


    return "home";

}


/* ======================================================
   HASH CHANGE
====================================================== */

function handleHashChange() {

    const page =
        getPageFromHash();


    loadPage(
        page
    );

}


/* ======================================================
   GLOBAL CLICK HANDLER
====================================================== */

function handleGlobalNavigationClick(
    event
) {

    const pageLink =
        event.target.closest(
            "[data-page]"
        );


    if (!pageLink) {
        return;
    }


    const page =
        pageLink.dataset.page;


    if (
        !page ||
        !PAGES[page]
    ) {
        return;
    }


    event.preventDefault();


    navigate(page);

}


/* ======================================================
   NAVIGATION INITIALIZATION
====================================================== */

function initializeNavigation() {

    if (navigationInitialized) {
        return;
    }


    navigationInitialized =
        true;


    /*
    ------------------------------------------------------
    MOBILE MENU
    ------------------------------------------------------
    */

    menuToggle?.addEventListener(
        "click",
        toggleMobileNavigation
    );


    /*
    ------------------------------------------------------
    ALL SPA LINKS
    ------------------------------------------------------
    */

    document.addEventListener(
        "click",
        handleGlobalNavigationClick
    );


    /*
    ------------------------------------------------------
    HASH CHANGES
    ------------------------------------------------------
    */

    window.addEventListener(
        "hashchange",
        handleHashChange
    );


    /*
    ------------------------------------------------------
    CLOSE MOBILE NAV WHEN CLICKING
    OUTSIDE
    ------------------------------------------------------
    */

    document.addEventListener(
        "click",
        (event) => {

            if (
                !navLinksContainer ||
                !menuToggle
            ) {
                return;
            }


            const clickedInsideNav =
                navLinksContainer.contains(
                    event.target
                );


            const clickedMenuToggle =
                menuToggle.contains(
                    event.target
                );


            if (
                !clickedInsideNav &&
                !clickedMenuToggle
            ) {

                closeMobileNavigation();

            }

        }
    );


    /*
    ------------------------------------------------------
    ESCAPE CLOSES MOBILE NAV
    ------------------------------------------------------
    */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                closeMobileNavigation();

            }

        }
    );


    /*
    ------------------------------------------------------
    BRAND
    ------------------------------------------------------
    */

    brandLink?.addEventListener(
        "click",
        () => {
            closeMobileNavigation();
        }
    );


    /*
    ------------------------------------------------------
    ORDER BUTTON
    ------------------------------------------------------
    */

    navOrderButton?.addEventListener(
        "click",
        () => {
            closeMobileNavigation();
        }
    );

}


/* ======================================================
   GLOBAL APP API
====================================================== */

window.KamotasApp = {

    navigate,

    loadPage,

    getCurrentPage: () =>
        currentPage,

    getPages: () =>
        Object.keys(PAGES)

};


/* ======================================================
   APPLICATION START
====================================================== */

function initializeApp() {

    updateFooterYear();

    initializeNavigation();

    handleHashChange();

}


initializeApp();