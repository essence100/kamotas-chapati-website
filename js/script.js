// ===============================
// MOBILE NAVBAR
// ===============================


const menuToggle = document.getElementById("menu-toggle");

const navLinks = document.getElementById("nav-links");



if(menuToggle){


    menuToggle.addEventListener("click",()=>{


        navLinks.classList.toggle("active");


    });


}



document.querySelectorAll(".nav-links a")
.forEach(link=>{


    link.addEventListener("click",()=>{


        navLinks.classList.remove("active");


    });


});








// ===============================
// ORDER SYSTEM
// ===============================


let currentOrder = null;





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

    "KMT-" +

    Math.floor(10000 + Math.random()*90000);







    currentOrder = {


        orderNumber,

        name,

        phone,

        food,

        quantity,

        location,

        message


    };







    // DISPLAY TICKET


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
    message;







    // SHOW TICKET


    const ticketSection =
    document.getElementById("ticket");



    ticketSection.style.display="block";






    // SAVE TEMPORARY


    localStorage.setItem(

        "kamotasOrder",

        JSON.stringify(currentOrder)

    );






    // MOVE TO TICKET


    ticketSection.scrollIntoView({

        behavior:"smooth"

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



        const link =
        document.createElement("a");



        link.download =
        "Kamotas-Order-Ticket.png";



        link.href =
        canvas.toDataURL("image/png");



        link.click();





    })



    .catch(error=>{


        console.log(error);


        alert("Ticket download failed");


    });



}









// ===============================
// SEND ORDER TO WHATSAPP
// ===============================


function sendTicketWhatsApp(){



    if(!currentOrder){



        const saved =
        localStorage.getItem("kamotasOrder");



        if(saved){


            currentOrder =
            JSON.parse(saved);


        }

        else{


            alert("Please place your order first");


            return;


        }


    }







    const whatsappNumber =

    "255782722871";







    const orderText =

`🍽️ KAMOTAS CHAPATI ORDER


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
${currentOrder.message}


❤️ Thank you for choosing Kamotas Chapati`;









    const whatsappURL =


    "https://wa.me/" +

    whatsappNumber +

    "?text=" +

    encodeURIComponent(orderText);







    window.open(

        whatsappURL,

        "_blank"

    );


}









// ===============================
// FOOTER YEAR
// ===============================


const footer =
document.querySelector("footer p");



if(footer){


    footer.innerHTML =

    `© ${new Date().getFullYear()} Kamotas Chapati | All Rights Reserved`;


}
