// =====================================
// KAMOTAS CHAPATI ORDER SYSTEM
// FINAL SCRIPT
// =====================================


let currentOrder = null;





// ===============================
// CREATE ORDER + TICKET
// ===============================


function sendOrder(event){

    event.preventDefault();


    const name =
    document.getElementById("name").value.trim();


    const phone =
    document.getElementById("phone").value.trim();


    const food =
    document.getElementById("food").value;


    const quantity =
    document.getElementById("quantity").value;


    const location =
    document.getElementById("location").value.trim();


    const message =
    document.getElementById("message").value.trim();





    const orderNumber =
    "KMT-" + Math.floor(10000 + Math.random()*90000);





    currentOrder = {

        orderNumber,
        name,
        phone,
        food,
        quantity,
        location,
        message

    };







    // PUT DATA INTO TICKET


    document.getElementById("orderId").innerText =
    orderNumber;


    document.getElementById("ticketName").innerText =
    name;


    document.getElementById("ticketPhone").innerText =
    phone;


    document.getElementById("ticketFood").innerText =
    food;


    document.getElementById("ticketQuantity").innerText =
    quantity;


    document.getElementById("ticketLocation").innerText =
    location;


    document.getElementById("ticketMessage").innerText =
    message || "None";






    // SHOW TICKET


    const ticket =
    document.getElementById("ticket");



    ticket.style.display="block";





    // CREATE QR


    createQRCode();





    ticket.scrollIntoView({

        behavior:"smooth"

    });



}









// ===============================
// QR CODE GENERATOR
// ===============================


function createQRCode(){


    const qr =
    document.getElementById("qrcode");



    if(!qr || !currentOrder){

        return;

    }



    qr.innerHTML="";




    new QRCode(qr,{


        text:

`KAMOTAS CHAPATI
ORDER: ${currentOrder.orderNumber}
CUSTOMER: ${currentOrder.name}
MEAL: ${currentOrder.food}
PHONE: ${currentOrder.phone}`,



        width:90,

        height:90


    });



}









// ===============================
// DOWNLOAD TICKET IMAGE
// ===============================


function downloadTicketImage(){


    const ticket =
    document.querySelector(".ticket");



    if(!ticket){

        alert("Ticket not available");

        return;

    }





    html2canvas(ticket,{

        scale:3,

        backgroundColor:"#ffffff"

    })



    .then(canvas=>{


        const link =
        document.createElement("a");



        link.download =
        "Kamotas-Order-Ticket.png";



        link.href =
        canvas.toDataURL("image/png");



        link.click();



    })



    .catch(()=>{


        alert("Download failed");


    });



}









// ===============================
// SEND TICKET TO WHATSAPP
// ===============================


function sendTicketWhatsApp(){



    if(!currentOrder){


        alert("Create order first");

        return;


    }





    const number =
    "255782722871";






    const message =


`KAMOTAS CHAPATI ORDER

Order ID:
${currentOrder.orderNumber}

Customer:
${currentOrder.name}

Phone:
${currentOrder.phone}

Meal:
${currentOrder.food}

Quantity:
${currentOrder.quantity}

Location:
${currentOrder.location}

Note:
${currentOrder.message || "None"}`;







    const url =

    "https://wa.me/" +

    number +

    "?text=" +

    encodeURIComponent(message);





    window.open(url,"_blank");



}









// ===============================
// MOBILE NAVBAR
// ===============================


const menuToggle =
document.getElementById("menu-toggle");


const navLinks =
document.getElementById("nav-links");





if(menuToggle){


    menuToggle.onclick=function(){


        navLinks.classList.toggle("active");


    };


}







document
.querySelectorAll(".nav-links a")
.forEach(link=>{


    link.onclick=function(){


        navLinks.classList.remove("active");


    };


});









// ===============================
// FOOTER YEAR
// ===============================


const footer =
document.querySelector("footer p");



if(footer){


footer.innerHTML =

`© ${new Date().getFullYear()} Kamotas Chapati | All Rights Reserved`;


}
