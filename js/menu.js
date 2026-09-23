"use strict";

/* =========================================================
   KAMOTAS CHAPATI
   MENU + CART SYSTEM
   ========================================================= */

/* =========================================================
   MENU DATA
   ========================================================= */

export const MENU_ITEMS = [
    {
        id: "chapati",
        name: "Fresh Chapati",
        category: "chapati",
        price: 500,
        image: "./assets/images/chapati.jpg",
        description:
            "Soft, fresh and tasty chapati made every day."
    },

    {
        id: "maharage",
        name: "Maharage",
        category: "meals",
        price: 500,
        image: "./assets/images/maharage.jpg",
        description:
            "Hot cooked beans with great taste."
    },

    {
        id: "supu",
        name: "Supu",
        category: "meals",
        price: 1000,
        image: "./assets/images/supu.jpg",
        description:
            "Fresh hot soup prepared daily."
    },

    {
        id: "roast-maini",
        name: "Roast Maini",
        category: "meals",
        price: 2000,
        image: "./assets/images/roast-maini.jpg",
        description:
            "Delicious roasted maini prepared fresh."
    },

    {
        id: "fresh-juice",
        name: "Fresh Juice",
        category: "drinks",
        price: 1000,
        image: "./assets/images/juice.jpg",
        description:
            "Cold refreshing fruit juice."
    }
];


/* =========================================================
   CONSTANTS
   ========================================================= */

const CART_STORAGE_KEY = "kamotas_cart_v1";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;


/* =========================================================
   STATE
   ========================================================= */

let cart = loadCart();

let selectedCategory = "all";

let productQuantities = {};

let menuPageElement = null;

let menuClickHandler = null;

let checkoutButtonHandler = null;

let mobileCheckoutButtonHandler = null;

let clearCartButtonHandler = null;

let checkoutCloseHandler = null;

let checkoutOverlayHandler = null;

let checkoutKeydownHandler = null;

let initialized = false;


/* =========================================================
   FORMAT MONEY
   ========================================================= */

export function formatMoney(amount) {
    return (
        "Tsh " +
        Number(amount || 0).toLocaleString("en-TZ")
    );
}


/* =========================================================
   LOAD CART
   ========================================================= */

function loadCart() {
    try {
        const saved =
            localStorage.getItem(CART_STORAGE_KEY);

        if (!saved) {
            return [];
        }

        const parsed = JSON.parse(saved);

        if (!Array.isArray(parsed)) {
            return [];
        }

        const cleanedCart = parsed
            .filter((item) => {
                if (!item || typeof item !== "object") {
                    return false;
                }

                const product = getProduct(item.id);

                return Boolean(product);
            })
            .map((item) => ({
                id: String(item.id),
                quantity: normalizeQuantity(
                    item.quantity
                )
            }));

        return cleanedCart;
    } catch (error) {
        console.warn(
            "Kamotas cart could not be loaded:",
            error
        );

        return [];
    }
}


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart() {
    try {
        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );
    } catch (error) {
        console.warn(
            "Kamotas cart could not be saved:",
            error
        );
    }
}


/* =========================================================
   NORMALIZE QUANTITY
   ========================================================= */

function normalizeQuantity(value) {
    const quantity = Number.parseInt(
        value,
        10
    );

    if (!Number.isFinite(quantity)) {
        return MIN_QUANTITY;
    }

    return Math.min(
        MAX_QUANTITY,
        Math.max(
            MIN_QUANTITY,
            quantity
        )
    );
}


/* =========================================================
   GET PRODUCT
   ========================================================= */

function getProduct(productId) {
    return MENU_ITEMS.find(
        (item) =>
            item.id === productId
    );
}


/* =========================================================
   GET CATEGORY LABEL
   ========================================================= */

function getCategoryLabel(category) {
    const labels = {
        chapati: "Chapati",
        meals: "Meal",
        drinks: "Drink"
    };

    return (
        labels[category] ||
        "Food"
    );
}


/* =========================================================
   GET CART ITEM COUNT
   ========================================================= */

export function getCartItemCount() {
    return cart.reduce(
        (total, item) =>
            total +
            normalizeQuantity(
                item.quantity
            ),
        0
    );
}


/* =========================================================
   GET CART TOTAL
   ========================================================= */

export function getCartTotal() {
    return cart.reduce(
        (total, item) => {
            const product =
                getProduct(item.id);

            if (!product) {
                return total;
            }

            return (
                total +
                product.price *
                    normalizeQuantity(
                        item.quantity
                    )
            );
        },
        0
    );
}


/* =========================================================
   DISPATCH CART UPDATE
   ========================================================= */

function dispatchCartUpdate() {
    document.dispatchEvent(
        new CustomEvent(
            "kamotas:cart-updated",
            {
                detail: {
                    cart: getCurrentCart(),
                    itemCount:
                        getCartItemCount(),
                    total:
                        getCartTotal()
                }
            }
        )
    );
}


/* =========================================================
   RENDER MENU
   ========================================================= */

function renderMenu() {
    const grid =
        document.getElementById(
            "menuGrid"
        );

    const count =
        document.getElementById(
            "menuItemCount"
        );

    if (!grid) {
        return;
    }

    const filteredItems =
        selectedCategory === "all"
            ? MENU_ITEMS
            : MENU_ITEMS.filter(
                  (item) =>
                      item.category ===
                      selectedCategory
              );

    if (count) {
        count.textContent =
            filteredItems.length;
    }

    grid.innerHTML =
        filteredItems
            .map(createMenuCard)
            .join("");

    bindMenuImageFallbacks(grid);
}


/* =========================================================
   CREATE MENU CARD
   ========================================================= */

function createMenuCard(item) {
    const quantity =
        productQuantities[item.id] ||
        MIN_QUANTITY;

    const categoryName =
        getCategoryLabel(
            item.category
        );

    return `
        <article
            class="menu-card"
            data-product-id="${item.id}"
        >

            <div class="menu-image-wrap">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                    class="menu-image"
                    loading="lazy"
                    data-fallback-image
                >

                <span class="menu-category">
                    ${categoryName}
                </span>

            </div>

            <div class="menu-card-body">

                <div class="menu-card-top">

                    <h3>
                        ${item.name}
                    </h3>

                    <span class="menu-price">
                        ${formatMoney(item.price)}
                    </span>

                </div>

                <p class="menu-description">
                    ${item.description}
                </p>

                <div class="product-actions">

                    <div
                        class="quantity-control"
                        aria-label="Quantity for ${item.name}"
                    >

                        <button
                            type="button"
                            class="product-minus"
                            data-product-id="${item.id}"
                            aria-label="Decrease ${item.name} quantity"
                        >
                            −
                        </button>

                        <span
                            class="quantity-value"
                            data-quantity-for="${item.id}"
                            aria-live="polite"
                        >
                            ${quantity}
                        </span>

                        <button
                            type="button"
                            class="product-plus"
                            data-product-id="${item.id}"
                            aria-label="Increase ${item.name} quantity"
                        >
                            +
                        </button>

                    </div>

                    <button
                        type="button"
                        class="add-to-cart"
                        data-product-id="${item.id}"
                    >
                        <i
                            class="fa-solid fa-cart-plus"
                            aria-hidden="true"
                        ></i>

                        <span>
                            Add to Cart
                        </span>
                    </button>

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   IMAGE FALLBACKS
   ========================================================= */

function bindMenuImageFallbacks(
    container
) {
    const images =
        container.querySelectorAll(
            "[data-fallback-image]"
        );

    images.forEach((image) => {
        image.addEventListener(
            "error",
            handleImageError,
            {
                once: true
            }
        );
    });
}


function handleImageError(event) {
    const image =
        event.currentTarget;

    if (!image) {
        return;
    }

    image.src =
        "./assets/images/food.jpg";
}


/* =========================================================
   UPDATE PRODUCT QUANTITY
   ========================================================= */

function updateProductQuantity(
    productId,
    change
) {
    const current =
        productQuantities[productId] ||
        MIN_QUANTITY;

    const next =
        Math.min(
            MAX_QUANTITY,
            Math.max(
                MIN_QUANTITY,
                current + change
            )
        );

    productQuantities[productId] =
        next;

    const quantityElement =
        document.querySelector(
            `[data-quantity-for="${productId}"]`
        );

    if (quantityElement) {
        quantityElement.textContent =
            next;
    }
}


/* =========================================================
   RESET PRODUCT QUANTITY
   ========================================================= */

function resetProductQuantity(
    productId
) {
    productQuantities[productId] =
        MIN_QUANTITY;

    const quantityElement =
        document.querySelector(
            `[data-quantity-for="${productId}"]`
        );

    if (quantityElement) {
        quantityElement.textContent =
            MIN_QUANTITY;
    }
}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(
    productId,
    quantity
) {
    const product =
        getProduct(productId);

    if (!product) {
        return;
    }

    const safeQuantity =
        normalizeQuantity(quantity);

    const existing =
        cart.find(
            (item) =>
                item.id === productId
        );

    if (existing) {
        existing.quantity =
            Math.min(
                MAX_QUANTITY,
                normalizeQuantity(
                    existing.quantity
                ) + safeQuantity
            );
    } else {
        cart.push({
            id: productId,
            quantity: safeQuantity
        });
    }

    saveCart();

    renderCart();

    updateMobileCart();

    dispatchCartUpdate();

    showCartFeedback(
        productId
    );

    resetProductQuantity(
        productId
    );
}


/* =========================================================
   CHANGE CART QUANTITY
   ========================================================= */

function changeCartQuantity(
    productId,
    change
) {
    const item =
        cart.find(
            (entry) =>
                entry.id === productId
        );

    if (!item) {
        return;
    }

    item.quantity =
        normalizeQuantity(
            item.quantity
        ) + change;

    if (
        item.quantity <=
        MIN_QUANTITY - 1
    ) {
        cart =
            cart.filter(
                (entry) =>
                    entry.id !==
                    productId
            );
    } else {
        item.quantity =
            Math.min(
                MAX_QUANTITY,
                item.quantity
            );
    }

    saveCart();

    renderCart();

    updateMobileCart();

    dispatchCartUpdate();
}


/* =========================================================
   REMOVE CART ITEM
   ========================================================= */

function removeFromCart(
    productId
) {
    const exists =
        cart.some(
            (item) =>
                item.id === productId
        );

    if (!exists) {
        return;
    }

    cart =
        cart.filter(
            (item) =>
                item.id !== productId
        );

    saveCart();

    renderCart();

    updateMobileCart();

    dispatchCartUpdate();
}


/* =========================================================
   CLEAR CART
   ========================================================= */

function clearCart() {
    if (cart.length === 0) {
        return;
    }

    const confirmed =
        window.confirm(
            "Clear all items from your cart?"
        );

    if (!confirmed) {
        return;
    }

    cart = [];

    productQuantities = {};

    saveCart();

    renderCart();

    updateMobileCart();

    dispatchCartUpdate();
}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {
    const cartItems =
        document.getElementById(
            "cartItems"
        );

    const cartCount =
        document.getElementById(
            "cartCount"
        );

    const cartItemsTotal =
        document.getElementById(
            "cartItemsTotal"
        );

    const cartSubtotal =
        document.getElementById(
            "cartSubtotal"
        );

    const cartTotal =
        document.getElementById(
            "cartTotal"
        );

    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );

    const itemCount =
        getCartItemCount();

    const total =
        getCartTotal();

    if (cartCount) {
        cartCount.textContent =
            itemCount;
    }

    if (cartItemsTotal) {
        cartItemsTotal.textContent =
            itemCount;
    }

    if (cartSubtotal) {
        cartSubtotal.textContent =
            formatMoney(total);
    }

    if (cartTotal) {
        cartTotal.textContent =
            formatMoney(total);
    }

    if (checkoutButton) {
        checkoutButton.disabled =
            cart.length === 0;
    }

    if (!cartItems) {
        return;
    }

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">

                <div
                    class="empty-cart-icon"
                    aria-hidden="true"
                >
                    <i class="fa-solid fa-basket-shopping"></i>
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add something delicious
                    from the menu.
                </p>

            </div>
        `;

        return;
    }

    cartItems.innerHTML =
        cart
            .map(createCartItem)
            .join("");

    bindCartImageFallbacks(
        cartItems
    );
}


/* =========================================================
   CREATE CART ITEM
   ========================================================= */

function createCartItem(
    cartItem
) {
    const product =
        getProduct(cartItem.id);

    if (!product) {
        return "";
    }

    const quantity =
        normalizeQuantity(
            cartItem.quantity
        );

    const lineTotal =
        product.price *
        quantity;

    return `
        <div
            class="cart-item"
            data-cart-product="${product.id}"
        >

            <div class="cart-item-main">

                <img
                    class="cart-item-image"
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    data-fallback-image
                >

                <div class="cart-item-info">

                    <h4 class="cart-item-name">
                        ${product.name}
                    </h4>

                    <div class="cart-item-price">
                        ${formatMoney(lineTotal)}
                    </div>

                    <div class="cart-item-controls">

                        <div
                            class="cart-quantity"
                            aria-label="Quantity for ${product.name}"
                        >

                            <button
                                type="button"
                                data-cart-action="decrease"
                                data-product-id="${product.id}"
                                aria-label="Decrease ${product.name} quantity"
                            >
                                −
                            </button>

                            <span
                                aria-live="polite"
                            >
                                ${quantity}
                            </span>

                            <button
                                type="button"
                                data-cart-action="increase"
                                data-product-id="${product.id}"
                                aria-label="Increase ${product.name} quantity"
                            >
                                +
                            </button>

                        </div>

                        <button
                            type="button"
                            class="remove-cart-item"
                            data-cart-action="remove"
                            data-product-id="${product.id}"
                        >
                            <i
                                class="fa-regular fa-trash-can"
                                aria-hidden="true"
                            ></i>

                            <span>
                                Remove
                            </span>
                        </button>

                    </div>

                </div>

            </div>

        </div>
    `;
}


/* =========================================================
   CART IMAGE FALLBACKS
   ========================================================= */

function bindCartImageFallbacks(
    container
) {
    const images =
        container.querySelectorAll(
            "[data-fallback-image]"
        );

    images.forEach((image) => {
        image.addEventListener(
            "error",
            handleImageError,
            {
                once: true
            }
        );
    });
}


/* =========================================================
   MOBILE CART
   ========================================================= */

function updateMobileCart() {
    const items =
        document.getElementById(
            "mobileCartItems"
        );

    const total =
        document.getElementById(
            "mobileCartTotal"
        );

    const count =
        document.getElementById(
            "mobileCartCount"
        );

    const itemCount =
        getCartItemCount();

    const cartTotal =
        getCartTotal();

    if (items) {
        items.textContent =
            `${itemCount} ${
                itemCount === 1
                    ? "item"
                    : "items"
            }`;
    }

    if (total) {
        total.textContent =
            formatMoney(
                cartTotal
            );
    }

    if (count) {
        count.textContent =
            itemCount;
    }

    const mobileBar =
        document.getElementById(
            "mobileCartBar"
        );

    if (mobileBar) {
        mobileBar.classList.toggle(
            "has-items",
            itemCount > 0
        );
    }
}


/* =========================================================
   CART FEEDBACK
   ========================================================= */

function showCartFeedback(
    productId
) {
    if (!menuPageElement) {
        return;
    }

    const button =
        menuPageElement.querySelector(
            `.add-to-cart[data-product-id="${productId}"]`
        );

    if (!button) {
        return;
    }

    if (
        button.dataset.feedbackActive ===
        "true"
    ) {
        return;
    }

    button.dataset.feedbackActive =
        "true";

    const originalHTML =
        button.innerHTML;

    button.innerHTML = `
        <i
            class="fa-solid fa-check"
            aria-hidden="true"
        ></i>

        <span>
            Added
        </span>
    `;

    button.classList.add(
        "is-added"
    );

    window.setTimeout(() => {
        if (!button.isConnected) {
            return;
        }

        button.innerHTML =
            originalHTML;

        button.classList.remove(
            "is-added"
        );

        delete button.dataset
            .feedbackActive;
    }, 1000);
}


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

function setCategory(
    category
) {
    selectedCategory =
        category || "all";

    document
        .querySelectorAll(
            ".category-btn"
        )
        .forEach((button) => {
            button.classList.toggle(
                "active",
                button.dataset.category ===
                    selectedCategory
            );

            button.setAttribute(
                "aria-selected",
                button.dataset.category ===
                    selectedCategory
                    ? "true"
                    : "false"
            );
        });

    renderMenu();
}


/* =========================================================
   FIND CHECKOUT OVERLAY
   ========================================================= */

function getCheckoutOverlay() {
    return (
        document.getElementById(
            "checkoutOverlay"
        ) ||
        document.getElementById(
            "checkoutModal"
        )
    );
}


/* =========================================================
   OPEN CHECKOUT
   ========================================================= */

export function openCheckout() {
    if (cart.length === 0) {
        window.alert(
            "Please add an item to your cart first."
        );

        return;
    }

    const overlay =
        getCheckoutOverlay();

    if (!overlay) {
        console.warn(
            "Kamotas checkout overlay was not found."
        );

        return;
    }

    const itemCount =
        document.getElementById(
            "checkoutItemCount"
        );

    const total =
        document.getElementById(
            "checkoutTotal"
        );

    if (itemCount) {
        itemCount.textContent =
            getCartItemCount();
    }

    if (total) {
        total.textContent =
            formatMoney(
                getCartTotal()
            );
    }

    overlay.classList.add(
        "open"
    );

    overlay.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "checkout-open"
    );

    const nameInput =
        document.getElementById(
            "checkoutName"
        );

    if (nameInput) {
        window.setTimeout(
            () => {
                nameInput.focus();
            },
            100
        );
    }
}


/* =========================================================
   CLOSE CHECKOUT
   ========================================================= */

export function closeCheckout() {
    const overlay =
        getCheckoutOverlay();

    if (!overlay) {
        return;
    }

    overlay.classList.remove(
        "open"
    );

    overlay.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "checkout-open"
    );
}


/* =========================================================
   HANDLE MENU EVENTS
   ========================================================= */

function handleMenuClick(
    event
) {
    const categoryButton =
        event.target.closest(
            ".category-btn"
        );

    if (categoryButton) {
        setCategory(
            categoryButton.dataset.category
        );

        return;
    }

    const productMinus =
        event.target.closest(
            ".product-minus"
        );

    if (productMinus) {
        updateProductQuantity(
            productMinus.dataset.productId,
            -1
        );

        return;
    }

    const productPlus =
        event.target.closest(
            ".product-plus"
        );

    if (productPlus) {
        updateProductQuantity(
            productPlus.dataset.productId,
            1
        );

        return;
    }

    const addButton =
        event.target.closest(
            ".add-to-cart"
        );

    if (addButton) {
        const productId =
            addButton.dataset.productId;

        const quantity =
            productQuantities[
                productId
            ] ||
            MIN_QUANTITY;

        addToCart(
            productId,
            quantity
        );

        return;
    }

    const cartAction =
        event.target.closest(
            "[data-cart-action]"
        );

    if (!cartAction) {
        return;
    }

    const productId =
        cartAction.dataset.productId;

    const action =
        cartAction.dataset.cartAction;

    if (action === "increase") {
        changeCartQuantity(
            productId,
            1
        );

        return;
    }

    if (action === "decrease") {
        changeCartQuantity(
            productId,
            -1
        );

        return;
    }

    if (action === "remove") {
        removeFromCart(
            productId
        );
    }
}


/* =========================================================
   BIND MENU EVENTS
   ========================================================= */

function bindMenuEvents() {
    if (!menuPageElement) {
        return;
    }

    menuClickHandler =
        handleMenuClick;

    menuPageElement.addEventListener(
        "click",
        menuClickHandler
    );


    /* -----------------------------------------
       DESKTOP CHECKOUT
       ----------------------------------------- */

    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );

    if (checkoutButton) {
        checkoutButtonHandler =
            openCheckout;

        checkoutButton.addEventListener(
            "click",
            checkoutButtonHandler
        );
    }


    /* -----------------------------------------
       MOBILE CHECKOUT
       ----------------------------------------- */

    const mobileCheckoutButton =
        document.getElementById(
            "mobileCheckoutButton"
        ) ||
        document.getElementById(
            "mobileCartButton"
        );

    if (mobileCheckoutButton) {
        mobileCheckoutButtonHandler =
            openCheckout;

        mobileCheckoutButton.addEventListener(
            "click",
            mobileCheckoutButtonHandler
        );
    }


    /* -----------------------------------------
       CLEAR CART
       ----------------------------------------- */

    const clearCartButton =
        document.getElementById(
            "clearCartButton"
        );

    if (clearCartButton) {
        clearCartButtonHandler =
            clearCart;

        clearCartButton.addEventListener(
            "click",
            clearCartButtonHandler
        );
    }


    /* -----------------------------------------
       CLOSE CHECKOUT
       ----------------------------------------- */

    const closeButton =
        document.getElementById(
            "checkoutClose"
        ) ||
        document.getElementById(
            "closeCheckout"
        );

    if (closeButton) {
        checkoutCloseHandler =
            closeCheckout;

        closeButton.addEventListener(
            "click",
            checkoutCloseHandler
        );
    }


    /* -----------------------------------------
       CLICK OUTSIDE CHECKOUT
       ----------------------------------------- */

    const overlay =
        getCheckoutOverlay();

    if (overlay) {
        checkoutOverlayHandler =
            (event) => {
                if (
                    event.target ===
                    overlay
                ) {
                    closeCheckout();
                }
            };

        overlay.addEventListener(
            "click",
            checkoutOverlayHandler
        );
    }


    /* -----------------------------------------
       ESCAPE KEY
       ----------------------------------------- */

    checkoutKeydownHandler =
        (event) => {
            if (
                event.key ===
                "Escape"
            ) {
                closeCheckout();
            }
        };

    document.addEventListener(
        "keydown",
        checkoutKeydownHandler
    );
}


/* =========================================================
   CLEANUP MENU EVENTS
   ========================================================= */

function cleanupMenuEvents() {
    if (
        menuPageElement &&
        menuClickHandler
    ) {
        menuPageElement.removeEventListener(
            "click",
            menuClickHandler
        );
    }

    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );

    if (
        checkoutButton &&
        checkoutButtonHandler
    ) {
        checkoutButton.removeEventListener(
            "click",
            checkoutButtonHandler
        );
    }

    const mobileCheckoutButton =
        document.getElementById(
            "mobileCheckoutButton"
        ) ||
        document.getElementById(
            "mobileCartButton"
        );

    if (
        mobileCheckoutButton &&
        mobileCheckoutButtonHandler
    ) {
        mobileCheckoutButton.removeEventListener(
            "click",
            mobileCheckoutButtonHandler
        );
    }

    const clearCartButton =
        document.getElementById(
            "clearCartButton"
        );

    if (
        clearCartButton &&
        clearCartButtonHandler
    ) {
        clearCartButton.removeEventListener(
            "click",
            clearCartButtonHandler
        );
    }

    const closeButton =
        document.getElementById(
            "checkoutClose"
        ) ||
        document.getElementById(
            "closeCheckout"
        );

    if (
        closeButton &&
        checkoutCloseHandler
    ) {
        closeButton.removeEventListener(
            "click",
            checkoutCloseHandler
        );
    }

    const overlay =
        getCheckoutOverlay();

    if (
        overlay &&
        checkoutOverlayHandler
    ) {
        overlay.removeEventListener(
            "click",
            checkoutOverlayHandler
        );
    }

    if (checkoutKeydownHandler) {
        document.removeEventListener(
            "keydown",
            checkoutKeydownHandler
        );
    }

    menuClickHandler = null;
    checkoutButtonHandler = null;
    mobileCheckoutButtonHandler = null;
    clearCartButtonHandler = null;
    checkoutCloseHandler = null;
    checkoutOverlayHandler = null;
    checkoutKeydownHandler = null;
}


/* =========================================================
   INITIALIZE MENU PAGE
   ========================================================= */

export function initMenuPage() {
    cleanupMenuEvents();

    menuPageElement =
        document.getElementById(
            "menuPage"
        ) ||
        document.getElementById(
            "menu-page"
        );

    if (!menuPageElement) {
        initialized = false;

        return () => {};
    }

    initialized = true;

    renderMenu();

    renderCart();

    updateMobileCart();

    bindMenuEvents();

    window.KamotasCart = {
        getCart: () =>
            getCurrentCart(),

        getTotal:
            getCurrentCartTotal,

        getItemCount:
            getCartItemCount,

        clear:
            clearCurrentCart,

        openCheckout:
            openCheckout,

        closeCheckout:
            closeCheckout
    };

    dispatchCartUpdate();

    return cleanupMenuPage;
}


/* =========================================================
   CLEANUP MENU PAGE
   ========================================================= */

export function cleanupMenuPage() {
    cleanupMenuEvents();

    closeCheckout();

    menuPageElement = null;

    initialized = false;
}


/* =========================================================
   GET CURRENT CART
   ========================================================= */

export function getCurrentCart() {
    return cart
        .map((item) => {
            const product =
                getProduct(item.id);

            if (!product) {
                return null;
            }

            return {
                id: item.id,

                name:
                    product.name,

                price:
                    product.price,

                quantity:
                    normalizeQuantity(
                        item.quantity
                    ),

                image:
                    product.image,

                description:
                    product.description
            };
        })
        .filter(Boolean);
}


/* =========================================================
   GET CURRENT CART TOTAL
   ========================================================= */

export function getCurrentCartTotal() {
    return getCartTotal();
}


/* =========================================================
   CLEAR CURRENT CART
   ========================================================= */

export function clearCurrentCart() {
    if (cart.length === 0) {
        return;
    }

    cart = [];

    productQuantities = {};

    saveCart();

    renderCart();

    updateMobileCart();

    dispatchCartUpdate();
}


/* =========================================================
   CHECK INITIALIZATION
   ========================================================= */

export function isMenuInitialized() {
    return initialized;
}