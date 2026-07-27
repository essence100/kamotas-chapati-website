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


    // GET FORM DATA

    const name = document.getElementById("name").value;

    const phone = document.getElementById("phone").value;

    const food = document.getElementById("food").value;

    const quantity = document.getElementById("quantity").value;

    const location = document.getElementById("location").value;

    const message = document.getElementById("message").value;




    // CREATE ORDER NUMBER

    const orderNumber = 
    "KMT-" + Math.floor(10000 + Math.random() * 90000);





    // SHOW TICKET DATA


    document.getElementById("orderId").innerHTML = orderNumber;


    document.getElementById("ticketName").innerHTML = name;


    document.getElementById("ticketPhone").innerHTML = phone;


    document.getElementById("ticketFood").innerHTML = food;


    document.getElementById("ticketQuantity").innerHTML = quantity;


    document.getElementById("ticketLocation").innerHTML = location;


    document.getElementById("ticketMessage").innerHTML = message;





    // SHOW TICKET SECTION

    document.getElementById("ticket").style.display = "block";



    // SCROLL TO TICKET

    document.getElementById("ticket")
    .scrollIntoView({
        behavior:"smooth"
    });



    // SAVE ORDER TEMPORARILY

    localStorage.setItem(
        "kamotasOrder",
        JSON.stringify({

            orderNumber,
            name,
            phone,
            food,
            quantity,
            location,
            message

        })
    );


}







// SEND TICKET TO WHATSAPP


function sendTicketWhatsApp(){


    const order = JSON.parse(
        localStorage.getItem("kamotasOrder")
    );



    const whatsappNumber = "255782722871";



    const text = 
`🍽️ KAMOTAS CHAPATI ORDER

🆔 Order ID:
${order.orderNumber}

👤 Customer:
${order.name}

📞 Phone:
${order.phone}

🍴 Meal:
${order.food}

🔢 Quantity:
${order.quantity}

📍 Location:
${order.location}

📝 Message:
${order.message}


❤️ Thank you for choosing Kamotas Chapati`;




    const url = 
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;



    window.open(url,"_blank");


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
