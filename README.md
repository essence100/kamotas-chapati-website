# Kamotas Chapati

A modern, responsive restaurant website for **Kamotas Chapati**, a local food brand based in Dodoma, Tanzania.

The website is designed to provide customers with a simple way to explore the menu, add meals to a cart, complete an order, generate an order ticket, view a QR code, download the ticket, and send the order through WhatsApp.

## Live Website

https://essence100.github.io/kamotas-chapati-website/

## GitHub Repository

https://github.com/essence100/kamotas-chapati-website

---

## About Kamotas Chapati

Kamotas Chapati is a food business serving fresh chapati and other affordable meals in Dodoma.

The website provides customers with information about the restaurant, available meals, location, contact channels, and an online ordering experience.

### Location

**St John's, UDOM, CBE, Mipango (Universities), Dodoma, Tanzania**

### Contact

**Phone / WhatsApp:**
+255 782 722 871

**Email:**
[essencebenedict@gmail.com](mailto:essencebenedict@gmail.com)

**Instagram:**
@benedict_charse

---

# Features

## Customer Experience

* Responsive design for desktop, tablet, and mobile
* Modern restaurant-focused interface
* Time-based greetings
* Home page
* About page
* Menu page
* Gallery page
* Contact page
* Mobile-friendly navigation
* Smooth SPA-style page navigation
* Google Maps location links
* WhatsApp ordering
* Phone contact
* Email contact
* Instagram link

## Menu & Ordering

* Menu categories
* Product cards
* Add items to cart
* Increase and decrease quantities
* Remove items from cart
* Clear cart
* Automatic subtotal calculation
* Automatic total calculation
* Persistent cart using `localStorage`
* Desktop cart panel
* Mobile sticky cart bar
* Checkout form
* Customer name
* Customer phone
* Customer location
* Optional order message

## Order Ticket

After checkout, the system generates an order ticket containing:

* Order ID
* Customer name
* Phone number
* Location
* Ordered items
* Quantities
* Total amount
* Customer message
* QR code

The ticket can also be:

* Downloaded as an image
* Sent through WhatsApp
* Used as an order reference

---

# Project Structure

```text
kamotas-chapati-website/
│
├── index.html
├── README.md
│
├── pages/
│   ├── home.html
│   ├── about.html
│   ├── menu.html
│   ├── gallery.html
│   └── contact.html
│
├── css/
│   ├── global.css
│   ├── home.css
│   ├── about.css
│   ├── menu.css
│   ├── gallery.css
│   └── contact.css
│
├── js/
│   ├── main.js
│   ├── menu.js
│   └── order.js
│
└── assets/
    └── images/
        ├── logo.png
        ├── hero-food.jpg
        ├── chapati.jpg
        ├── maharage.jpg
        ├── supu.jpg
        ├── juice.jpg
        ├── roast-maini.jpg
        ├── food.jpg
        ├── restaurant.jpg
        ├── gallery-1.jpg
        ├── gallery-2.jpg
        └── gallery-3.jpg
```

---

# Architecture

The website uses a lightweight **Single Page Application (SPA)** approach while remaining a static website.

The main `index.html` acts as the application shell.

Individual pages are stored separately inside the `pages/` directory and loaded dynamically into:

```html
<main id="app"></main>
```

Navigation uses URL hashes:

```text
#home
#about
#menu
#gallery
#contact
```

This allows the website to work with GitHub Pages without requiring a backend server.

---

# JavaScript Architecture

## `main.js`

Responsible for the main application flow.

It handles:

* SPA navigation
* Hash routing
* Loading page fragments
* Dynamic page CSS
* Page titles
* Mobile navigation
* Time-based greetings
* Page initialization
* Page cleanup
* Menu integration
* Order system integration
* Gallery initialization

Example:

```text
#home     → pages/home.html
#about    → pages/about.html
#menu     → pages/menu.html
#gallery  → pages/gallery.html
#contact  → pages/contact.html
```

---

## `menu.js`

Responsible for the restaurant menu and shopping cart.

Main responsibilities:

* Menu data
* Categories
* Product rendering
* Quantity controls
* Cart state
* Cart rendering
* `localStorage`
* Checkout opening
* Checkout closing
* Mobile cart
* Cart totals

The cart is stored locally in the browser.

Storage key:

```text
kamotas_cart_v1
```

---

## `order.js`

Responsible for the complete ordering process.

It handles:

* Checkout form submission
* Order ID generation
* Ticket generation
* QR code generation
* Ticket rendering
* Ticket download
* WhatsApp message generation
* WhatsApp order sending
* Order state management
* Cleanup of event listeners

Order IDs follow this format:

```text
KMT-12345
```

---

# Menu

Current menu items include:

| Item          |     Price |
| ------------- | --------: |
| Fresh Chapati |   Tsh 500 |
| Maharage      |   Tsh 500 |
| Supu          | Tsh 1,000 |
| Fresh Juice   | Tsh 1,000 |
| Roast Maini   | Tsh 2,000 |

Prices and menu items are controlled from:

```text
js/menu.js
```

---

# Contact

Customers can contact Kamotas through:

### WhatsApp

```text
+255 782 722 871
```

### Phone

```text
+255 782 722 871
```

### Email

```text
essencebenedict@gmail.com
```

### Instagram

```text
@benedict_charse
```

### Location

```text
St John's, UDOM, CBE, Mipango (Universities)
Dodoma, Tanzania
```

Google Maps links are available directly from the Contact page.

---

# Dynamic Greetings

The website displays a time-based greeting on each page.

### Morning

```text
5:00 AM – 11:59 AM
Good Morning
```

### Afternoon

```text
12:00 PM – 4:59 PM
Good Afternoon
```

### Evening

```text
5:00 PM – 4:59 AM
Good Evening
```

Each page also has its own message.

| Page    | Message                      |
| ------- | ---------------------------- |
| Home    | Welcome to Kamotas           |
| About   | Welcome to our story         |
| Menu    | What are you craving?        |
| Gallery | Welcome to our moments       |
| Contact | We're happy to hear from you |

---

# Responsive Design

The website is designed for multiple screen sizes:

```text
320px
360px
390px
430px
768px
1024px
1280px
1440px+
```

The responsive system focuses on:

* Mobile-first layouts
* Flexible cards
* Responsive typography
* Touch-friendly buttons
* Mobile navigation
* Mobile cart
* Responsive gallery
* Responsive checkout
* No unnecessary horizontal scrolling

---

# Technologies

The project uses:

* HTML5
* CSS3
* JavaScript ES Modules
* LocalStorage API
* Font Awesome
* Google Fonts
* HTML2Canvas
* QRCode.js
* Git
* GitHub
* GitHub Pages

No backend or database is currently required.

---

# External Libraries

## Font Awesome

Used for interface and social icons.

https://fontawesome.com/

## Google Fonts

Used for the website typography.

https://fonts.google.com/

## html2canvas

Used to convert the generated order ticket into a downloadable image.

https://html2canvas.hertzen.com/

## QRCode.js

Used to generate QR codes for order tickets.

https://davidshimjs.github.io/qrcodejs/

---

# Running the Project Locally

Because the website loads HTML fragments dynamically using `fetch()`, it should not be opened directly using:

```text
file://
```

Instead, run a local web server.

## Using Python

Open PowerShell in the project directory:

```powershell
cd C:\Users\Kibaka_fx\Desktop\ESSENCE\kamotas-chapati-website
```

Then run:

```powershell
python -m http.server 8000
```

Open:

```text
http://127.0.0.1:8000/
```

---

# Testing Navigation

Test each route using the hash navigation:

```text
http://127.0.0.1:8000/#home
```

```text
http://127.0.0.1:8000/#about
```

```text
http://127.0.0.1:8000/#menu
```

```text
http://127.0.0.1:8000/#gallery
```

```text
http://127.0.0.1:8000/#contact
```

---

# Testing the Ordering System

The recommended testing flow is:

```text
Home
  ↓
Menu
  ↓
Select Category
  ↓
Add Food
  ↓
Cart
  ↓
Checkout
  ↓
Enter Customer Details
  ↓
Generate Order
  ↓
Order Ticket
  ↓
QR Code
  ↓
Download Ticket
  ↓
WhatsApp
```

Test both:

* Desktop cart
* Mobile cart

Also test page navigation before and after opening the cart or checkout to ensure duplicate event listeners are not created.

---

# GitHub Pages Deployment

The project is configured for GitHub Pages.

Repository:

```text
essence100/kamotas-chapati-website
```

Main branch:

```text
main
```

The website uses relative paths such as:

```text
./css/global.css
./js/main.js
./pages/home.html
./assets/images/logo.png
```

Relative paths are important because the project is hosted inside the GitHub Pages repository path.

---

# Git Workflow

Check the current state:

```powershell
git status
```

Add changes:

```powershell
git add -A
```

Commit:

```powershell
git commit -m "Update Kamotas website"
```

Push:

```powershell
git push origin main
```

Check the final state:

```powershell
git status
```

Expected result:

```text
nothing to commit, working tree clean
```

---

# Design Direction

The website uses a warm premium food-brand visual language.

Primary visual characteristics:

* Warm dark background
* Cream surfaces
* Orange primary accent
* Gold secondary accent
* Rounded cards
* Soft shadows
* Strong typography
* Food-focused imagery
* Responsive layouts
* Subtle animations

The design intentionally avoids a generic corporate or AI-dashboard appearance.

---

# Development Principles

The project follows these principles:

### Modular

Pages, styles, and JavaScript responsibilities are separated.

### Lightweight

No unnecessary framework or backend is required.

### Maintainable

Each page has its own HTML and CSS.

### Responsive

The interface is designed for mobile, tablet, and desktop.

### User-focused

The ordering experience is treated as the main functionality.

### GitHub Pages compatible

The project works as a static website without server-side rendering.

---

# Future Improvements

Possible future improvements include:

* Real payment integration
* Online order database
* Admin dashboard
* Order management
* Customer order history
* Real-time order status
* Restaurant analytics
* Better image optimization
* Progressive Web App support
* Push notifications
* Backend API
* Cloud database
* Online reservation system

These features can be added later without replacing the current frontend architecture.

---

# Project Status

**Current status: Active development**

The main frontend structure has been migrated to a modular SPA architecture.

Completed areas include:

* Home
* About
* Menu
* Gallery
* Contact
* Responsive navigation
* Menu categories
* Shopping cart
* LocalStorage cart persistence
* Checkout
* Order ticket
* QR code
* Ticket download
* WhatsApp ordering
* Google Maps integration
* GitHub Pages compatibility

---

# License

This project is developed for the Kamotas Chapati website.

All branding, business information, images, logos, and other proprietary content belong to their respective owners.

---

## Built for Kamotas Chapati

**Fresh food. Great taste.**

**Dodoma, Tanzania**
