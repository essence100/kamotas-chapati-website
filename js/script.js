// ===============================
// KAMOTAS CHAPATI ORDER SYSTEM
// ===============================


let currentOrder = null;





// ===============================
// SEND ORDER / CREATE TICKET
// ===============================


function sendOrder(event){


    event.preventDefault();



    // GET FORM DATA


    const name = document
    .getElementById("name")
    .value
    .trim();



    const phone = document
    .getElementById("phone")
    .value
    .trim();



    const food = document
    .getElementById("food")
    .value;



    const quantity = document
    .getElementById("quantity")
    .value;



    const location = document
    .getElementById("location")
    .value
    .trim();



    const message = document
    .getElementById("message")
    .value
    .trim();





    // CREATE ORDER NUMBER


    const orderNumber =
    "KMT-" +
    Math.floor(10000 + Math.random() * 90000);







    // SAVE ORDER


    currentOrder = {


        orderNumber,

        name,

        phone,

        food,

        quantity,

        location,

        message,


        date:new Date()
        .toLocaleString()


    };







    // DISPLAY TICKET DATA


    document
    .getElementById("orderId")
    .innerText = orderNumber;



    document
    .getElementById("ticketName")
    .innerText = name;



    document
    .getElementById("ticketPhone")
    .innerText = phone;



    document
    .getElementById("ticketFood")
    .innerText = food;



    document
    .getElementById("ticketQuantity")
    .innerText = quantity;



    document
    .getElementById("ticketLocation")
    .innerText = location;



    document
    .getElementById("ticketMessage")
    .innerText =
    message || "No message";







    // SHOW TICKET


    const ticket =
    document.getElementById("ticket");



    if(ticket){


        ticket.style.display="block";


    }








    // GENERATE QR CODE


    createQRCode();








    // MOVE TO TICKET


    ticket.scrollIntoView({

        behavior:"smooth"

    });



}









// ===============================
// CREATE QR CODE
// ===============================


function createQRCode(){



    const qr =
    document.getElementById("qrcode");



    if(!qr || !currentOrder){

        return;

    }




    // clear old QR


    qr.innerHTML="";






    const qrText =

`
Kamotas Chapati

Order ID:
${currentOrder.orderNumber}


Customer:
${currentOrder.name}


Meal:
${currentOrder.food}


Phone:
${currentOrder.phone}


WhatsApp:
+255782722871
`;







    new QRCode(qr,{


        text:qrText,


        width:120,


        height:120


    });



}









// ===============================
// DOWNLOAD TICKET IMAGE
// ===============================


function downloadTicketImage(){



    const ticket =
    document.querySelector(".ticket");




    if(!ticket){


        alert("Ticket not found");


        return;


    }







    html2canvas(ticket,{


        scale:3,


        backgroundColor:"#ffffff"



    })



    .then(canvas=>{



        const image =
        canvas.toDataURL(
        "image/png"
        );





        const link =
        document.createElement("a");



        link.href=image;



        link.download =
        "Kamotas-Order-Ticket.png";



        link.click();




    })



    .catch(error=>{


        console.log(error);


        alert(
        "Unable to download ticket"
        );


    });



}









// ===============================
// SEND ORDER TO WHATSAPP
// ===============================


function sendTicketWhatsApp(){



    if(!currentOrder){



        alert(
        "Please create order first"
        );


        return;


    }








    const whatsappNumber =
    "255782722871";






    const text =


`🍽️ *KAMOTAS CHAPATI ORDER*

🆔 Order ID:
${currentOrder.orderNumber}


👤 Customer:
${currentOrder.name}


📞 Phone:
${currentOrder.phone}


🍴 Meal:
${currentOrder.food}


🔢 Quantity:
${currentOrder.quantity}


📍 Location:
${currentOrder.location}


📝 Message:
${currentOrder.message || "No message"}


❤️ Thank you for choosing Kamotas Chapati`;







    const url =

    "https://wa.me/" +

    whatsappNumber +

    "?text=" +

    encodeURIComponent(text);






    window.open(

        url,

        "_blank"

    );



}








// ===============================
// MOBILE NAVBAR
// ===============================


const menuToggle =
document.getElementById(
"menu-toggle"
);



const navLinks =
document.getElementById(
"nav-links"
);




if(menuToggle){


menuToggle.onclick=function(){


    navLinks.classList.toggle(
    "active"
    );


};



}







// CLOSE MOBILE MENU


document
.querySelectorAll(".nav-links a")
.forEach(link=>{


link.onclick=function(){


    if(navLinks){

        navLinks.classList.remove(
        "active"
        );

    }


};



});








// ===============================
// FOOTER YEAR
// ===============================


const footer =
document.querySelector(
"footer p"
);



if(footer){


footer.innerHTML =

`© ${new Date().getFullYear()} Kamotas Chapati | All Rights Reserved`;


}
