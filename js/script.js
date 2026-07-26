// ===============================
// MOBILE NAVBAR TOGGLE
// ===============================


const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");


menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");


});





// ===============================
// CLOSE MENU AFTER CLICKING LINK
// ===============================


const links = document.querySelectorAll(".nav-links a");


links.forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

    });

});






// ===============================
// SIMPLE SCROLL ANIMATION
// ===============================


const sections = document.querySelectorAll("section");


window.addEventListener("scroll", () => {


    sections.forEach(section => {


        const sectionTop = section.getBoundingClientRect().top;

        const screenPosition = window.innerHeight / 1.3;



        if(sectionTop < screenPosition){

            section.style.opacity = "1";
            section.style.transform = "translateY(0)";

        }


    });


});






// ===============================
// INITIAL SECTION STYLE
// ===============================


sections.forEach(section => {

    section.style.opacity = "0";
    section.style.transform = "translateY(40px)";
    section.style.transition = "0.8s ease";


});






function sendOrder(event){

    event.preventDefault();


    let name = document.getElementById("name").value;

    let phone = document.getElementById("phone").value;

    let food = document.getElementById("food").value;

    let quantity = document.getElementById("quantity").value;

    let location = document.getElementById("location").value;

    let message = document.getElementById("message").value;



    let text = 
`Hello Kamotas Chapati,

New Order:

Name: ${name}

Phone: ${phone}

Order: ${food}

Quantity: ${quantity}

Location: ${location}

Message: ${message}

Thank you.`;



    let whatsapp = 
    "https://wa.me/255782722871?text=" 
    + encodeURIComponent(text);



    window.open(whatsapp,"_blank");

}









// ===============================
// CURRENT YEAR FOOTER
// ===============================


const year = new Date().getFullYear();

const footerText = document.querySelector("footer p");


if(footerText){

    footerText.innerHTML =
    `© ${year} Kamotas Chapati | All Rights Reserved`;

}
