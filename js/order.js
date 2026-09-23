/*
=========================================================
    KAMOTAS CHAPATI
    ORDER / TICKET / QR / WHATSAPP SYSTEM
=========================================================
*/

import {
    getCurrentCart,
    getCurrentCartTotal,
    clearCurrentCart
} from "./menu.js";


/* ======================================================
   STATE
====================================================== */

let currentOrder = null;

let checkoutFormHandler = null;

let downloadButtonHandler = null;

let whatsappButtonHandler = null;

let continueShoppingHandler = null;

let initialized = false;


/* ======================================================
   CONSTANTS
====================================================== */

const WHATSAPP_NUMBER =
    "255782722871";


/* ======================================================
   HELPERS
====================================================== */

function formatMoney(amount) {

    return (
        "Tsh " +
        Number(amount || 0)
            .toLocaleString("en-TZ")
    );

}


function getElement(id) {

    return document.getElementById(id);

}


/* ======================================================
   ORDER ID
====================================================== */

function generateOrderId() {

    return (
        "KMT-" +
        Math.floor(
            10000 +
            Math.random() * 90000
        )
    );

}


/* ======================================================
   WHATSAPP MESSAGE
====================================================== */

function buildWhatsAppMessage() {

    if (!currentOrder) {
        return "";
    }


    const lines = [];


    lines.push(
        "KAMOTAS CHAPATI ORDER"
    );


    lines.push("");


    lines.push(
        `Order ID: ${currentOrder.orderNumber}`
    );


    lines.push(
        `Customer: ${currentOrder.name}`
    );


    lines.push(
        `Phone: ${currentOrder.phone}`
    );


    lines.push("");


    lines.push(
        "ORDER ITEMS:"
    );


    currentOrder.items.forEach(
        (item) => {

            const lineTotal =
                Number(item.price || 0) *
                Number(item.quantity || 0);


            lines.push(
                `${item.name} x${item.quantity} - ${formatMoney(lineTotal)}`
            );

        }
    );


    lines.push("");


    lines.push(
        `TOTAL: ${formatMoney(currentOrder.total)}`
    );


    lines.push(
        `Location: ${currentOrder.location}`
    );


    lines.push(
        `Note: ${currentOrder.message || "None"}`
    );


    return lines.join("\n");

}


/* ======================================================
   QR CODE
====================================================== */

function createQRCode() {

    const qr =
        getElement("qrcode");


    if (
        !qr ||
        !currentOrder
    ) {
        return;
    }


    qr.innerHTML = "";


    if (
        typeof QRCode ===
        "undefined"
    ) {

        qr.innerHTML = `
            <span
                style="
                    color:#9b4c3b;
                    font-size:11px;
                    text-align:center;
                    display:block;
                "
            >
                QR code library unavailable
            </span>
        `;

        return;

    }


    const qrText =
        buildWhatsAppMessage();


    try {

        new QRCode(
            qr,
            {
                text: qrText,
                width: 110,
                height: 110,
                correctLevel:
                    QRCode.CorrectLevel.M
            }
        );

    } catch (error) {

        console.error(
            "QR code generation failed:",
            error
        );


        qr.innerHTML = `
            <span
                style="
                    color:#9b4c3b;
                    font-size:11px;
                    text-align:center;
                    display:block;
                "
            >
                QR code could not be generated
            </span>
        `;

    }

}


/* ======================================================
   HTML ESCAPE
====================================================== */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(
            /[&<>"']/g,
            (character) => {

                const entities = {

                    "&": "&amp;",

                    "<": "&lt;",

                    ">": "&gt;",

                    '"': "&quot;",

                    "'": "&#039;"

                };


                return entities[
                    character
                ];

            }
        );

}


/* ======================================================
   RENDER TICKET ITEMS
====================================================== */

function renderTicketItems() {

    const container =
        getElement("ticketItems");


    if (
        !container ||
        !currentOrder
    ) {
        return;
    }


    container.innerHTML =
        currentOrder.items
            .map(
                (item) => {

                    const lineTotal =
                        Number(item.price || 0) *
                        Number(item.quantity || 0);


                    return `
                        <div class="ticket-item">

                            <div class="ticket-item-info">

                                <strong>
                                    ${escapeHtml(item.name)}
                                </strong>

                                <span>
                                    ${item.quantity}
                                    ×
                                    ${formatMoney(item.price)}
                                </span>

                            </div>

                            <div class="ticket-item-price">
                                ${formatMoney(lineTotal)}
                            </div>

                        </div>
                    `;

                }
            )
            .join("");

}


/* ======================================================
   RENDER TICKET
====================================================== */

function renderTicket() {

    if (!currentOrder) {
        return;
    }


    const orderId =
        getElement("orderId") ||
        getElement("ticketOrderId");


    const name =
        getElement("ticketName");


    const phone =
        getElement("ticketPhone");


    const location =
        getElement("ticketLocation");


    const message =
        getElement("ticketMessage");


    const total =
        getElement("ticketTotal");


    if (orderId) {

        orderId.textContent =
            currentOrder.orderNumber;

    }


    if (name) {

        name.textContent =
            currentOrder.name;

    }


    if (phone) {

        phone.textContent =
            currentOrder.phone;

    }


    if (location) {

        location.textContent =
            currentOrder.location;

    }


    if (message) {

        message.textContent =
            currentOrder.message ||
            "None";

    }


    if (total) {

        total.textContent =
            formatMoney(
                currentOrder.total
            );

    }


    renderTicketItems();

    createQRCode();

}


/* ======================================================
   SHOW TICKET
====================================================== */

function showTicket() {

    const section =
        getElement("ticketSection");


    if (!section) {
        return;
    }


    section.hidden = false;


    section.classList.add(
        "visible"
    );


    setTimeout(
        () => {

            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        },
        100
    );

}


/* ======================================================
   CREATE ORDER
====================================================== */

function createOrder(
    customerData
) {

    const items =
        getCurrentCart();


    if (
        !items ||
        items.length === 0
    ) {

        window.alert(
            "Your cart is empty. Please add an item first."
        );

        return false;

    }


    currentOrder = {

        orderNumber:
            generateOrderId(),

        name:
            String(
                customerData.name || ""
            ).trim(),

        phone:
            String(
                customerData.phone || ""
            ).trim(),

        location:
            String(
                customerData.location || ""
            ).trim(),

        message:
            String(
                customerData.message || ""
            ).trim(),

        items:
            items.map(
                (item) => ({

                    id: item.id,

                    name: item.name,

                    price:
                        Number(
                            item.price || 0
                        ),

                    quantity:
                        Number(
                            item.quantity || 1
                        ),

                    image:
                        item.image || ""

                })
            ),

        total:
            getCurrentCartTotal(),

        createdAt:
            new Date().toISOString()

    };


    renderTicket();

    showTicket();


    /*
    ------------------------------------------------------
    IMPORTANT
    Cart is cleared ONLY after the order has been
    successfully created and ticket rendered.
    ------------------------------------------------------
    */

    clearCurrentCart();


    return true;

}


/* ======================================================
   DOWNLOAD TICKET
====================================================== */

async function downloadTicketImage() {

    const ticket =
        getElement("ticket");


    if (!ticket) {

        window.alert(
            "Ticket not available."
        );

        return;

    }


    if (
        typeof html2canvas ===
        "undefined"
    ) {

        window.alert(
            "Ticket download library is unavailable."
        );

        return;

    }


    try {

        const canvas =
            await html2canvas(
                ticket,
                {
                    scale: 3,
                    backgroundColor:
                        "#ffffff",
                    useCORS: true,
                    logging: false
                }
            );


        const link =
            document.createElement(
                "a"
            );


        const orderId =
            currentOrder?.orderNumber ||
            "KMT-ORDER";


        link.download =
            `Kamotas-${orderId}-Ticket.png`;


        link.href =
            canvas.toDataURL(
                "image/png"
            );


        link.click();


    } catch (error) {

        console.error(
            "Ticket download failed:",
            error
        );


        window.alert(
            "Ticket download failed. Please try again."
        );

    }

}


/* ======================================================
   SEND TICKET TO WHATSAPP
====================================================== */

function sendTicketWhatsApp() {

    if (!currentOrder) {

        window.alert(
            "Create an order first."
        );

        return;

    }


    const message =
        buildWhatsAppMessage();


    const url =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(
            message
        );


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


/* ======================================================
   CONTINUE SHOPPING
====================================================== */

function continueShopping() {

    if (
        window.KamotasApp &&
        typeof window.KamotasApp.navigate ===
            "function"
    ) {

        window.KamotasApp.navigate(
            "menu"
        );

        return;

    }


    window.location.hash =
        "#menu";

}


/* ======================================================
   CHECKOUT SUBMIT
====================================================== */

function handleCheckoutSubmit(
    event
) {

    event.preventDefault();


    const form =
        event.currentTarget;


    const formData =
        new FormData(form);


    const name =
        String(
            formData.get("name") || ""
        ).trim();


    const phone =
        String(
            formData.get("phone") || ""
        ).trim();


    const location =
        String(
            formData.get("location") || ""
        ).trim();


    const message =
        String(
            formData.get("message") || ""
        ).trim();


    if (!name) {

        window.alert(
            "Please enter your name."
        );

        return;

    }


    if (!phone) {

        window.alert(
            "Please enter your phone number."
        );

        return;

    }


    if (!location) {

        window.alert(
            "Please enter your location."
        );

        return;

    }


    const success =
        createOrder({
            name,
            phone,
            location,
            message
        });


    if (!success) {
        return;
    }


    form.reset();


    const overlay =
        getElement(
            "checkoutOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "open"
        );


        overlay.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    document.body.classList.remove(
        "checkout-open"
    );

}


/* ======================================================
   INITIALIZE ORDER SYSTEM
====================================================== */

export function initOrderSystem() {

    /*
    ------------------------------------------------------
    ALWAYS CLEAN OLD LISTENERS FIRST
    ------------------------------------------------------
    */

    cleanupOrderSystem();


    const checkoutForm =
        getElement(
            "checkoutForm"
        );


    if (!checkoutForm) {

        initialized = false;

        return null;

    }


    /*
    ------------------------------------------------------
    CHECKOUT FORM
    ------------------------------------------------------
    */

    checkoutFormHandler =
        handleCheckoutSubmit;


    checkoutForm.addEventListener(
        "submit",
        checkoutFormHandler
    );


    /*
    ------------------------------------------------------
    DOWNLOAD BUTTON
    ------------------------------------------------------
    */

    const downloadButton =
        getElement(
            "downloadTicketButton"
        );


    if (downloadButton) {

        downloadButtonHandler =
            downloadTicketImage;


        downloadButton.addEventListener(
            "click",
            downloadButtonHandler
        );

    }


    /*
    ------------------------------------------------------
    WHATSAPP BUTTON
    ------------------------------------------------------
    */

    const whatsappButton =
        getElement(
            "whatsappTicketButton"
        );


    if (whatsappButton) {

        whatsappButtonHandler =
            sendTicketWhatsApp;


        whatsappButton.addEventListener(
            "click",
            whatsappButtonHandler
        );

    }


    /*
    ------------------------------------------------------
    CONTINUE SHOPPING
    ------------------------------------------------------
    */

    const continueShoppingButton =
        getElement(
            "continueShoppingButton"
        );


    if (continueShoppingButton) {

        continueShoppingHandler =
            continueShopping;


        continueShoppingButton.addEventListener(
            "click",
            continueShoppingHandler
        );

    }


    /*
    ------------------------------------------------------
    PUBLIC ORDER API
    ------------------------------------------------------
    */

    window.KamotasOrder = {

        getCurrentOrder:
            () => currentOrder,

        downloadTicket:
            downloadTicketImage,

        sendWhatsApp:
            sendTicketWhatsApp,

        createOrder,

        continueShopping

    };


    initialized = true;


    return cleanupOrderSystem;

}


/* ======================================================
   CLEANUP ORDER SYSTEM
====================================================== */

export function cleanupOrderSystem() {

    const checkoutForm =
        getElement(
            "checkoutForm"
        );


    if (
        checkoutForm &&
        checkoutFormHandler
    ) {

        checkoutForm.removeEventListener(
            "submit",
            checkoutFormHandler
        );

    }


    const downloadButton =
        getElement(
            "downloadTicketButton"
        );


    if (
        downloadButton &&
        downloadButtonHandler
    ) {

        downloadButton.removeEventListener(
            "click",
            downloadButtonHandler
        );

    }


    const whatsappButton =
        getElement(
            "whatsappTicketButton"
        );


    if (
        whatsappButton &&
        whatsappButtonHandler
    ) {

        whatsappButton.removeEventListener(
            "click",
            whatsappButtonHandler
        );

    }


    const continueShoppingButton =
        getElement(
            "continueShoppingButton"
        );


    if (
        continueShoppingButton &&
        continueShoppingHandler
    ) {

        continueShoppingButton.removeEventListener(
            "click",
            continueShoppingHandler
        );

    }


    checkoutFormHandler = null;

    downloadButtonHandler = null;

    whatsappButtonHandler = null;

    continueShoppingHandler = null;


    initialized = false;


    /*
    ------------------------------------------------------
    REMOVE PUBLIC API
    ------------------------------------------------------
    */

    if (
        window.KamotasOrder
    ) {

        delete window.KamotasOrder;

    }

}


/* ======================================================
   GET CURRENT ORDER
====================================================== */

export function getCurrentOrder() {

    return currentOrder;

}


/* ======================================================
   ORDER SYSTEM STATUS
====================================================== */

export function isOrderSystemInitialized() {

    return initialized;

}