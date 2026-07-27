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


    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const food = document.getElementById("food").value;
    const quantity = document.getElementById("quantity").value;
    const location = document.getElementById("location").value;
    const message = document.getElementById("message").value;



    const whatsappNumber = "255782722871";


    const orderMessage = 
`🍽️ *KAMOTAS CHAPATI ORDER*

👤 *Customer:*
${name}

📞 *Phone:*
${phone}

🍴 *Meal:*
${food}

🔢 *Quantity:*
${quantity}

📍 *Location:*
${location}

📝 *Additional Message:*
${message}


❤️ Thank you for choosing Kamotas Chapati`;



    const whatsappURL = 
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;



    window.open(whatsappURL, "_blank");


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
