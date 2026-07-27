// ===============================
// ORDER SYSTEM
// ===============================


let currentOrder = null;




function sendOrder(event){

    event.preventDefault();



    const name = document.getElementById("name").value.trim();

    const phone = document.getElementById("phone").value.trim();

    const food = document.getElementById("food").value;

    const quantity = document.getElementById("quantity").value;

    const location = document.getElementById("location").value.trim();

    const message = document.getElementById("message").value.trim();






    // CREATE ORDER NUMBER

    const orderNumber = 
    "KMT-" + Math.floor(10000 + Math.random() * 90000);






    currentOrder = {

        orderNumber,
        name,
        phone,
        food,
        quantity,
        location,
        message

    };







    // DISPLAY TICKET DATA


    document.getElementById("orderId").innerText = orderNumber;


    document.getElementById("ticketName").innerText = name;


    document.getElementById("ticketPhone").innerText = phone;


    document.getElementById("ticketFood").innerText = food;


    document.getElementById("ticketQuantity").innerText = quantity;


    document.getElementById("ticketLocation").innerText = location;


    document.getElementById("ticketMessage").innerText = message;







    // SHOW TICKET


    const ticket = document.getElementById("ticket");


    ticket.style.display = "block";






    // SCROLL TO TICKET


    ticket.scrollIntoView({

        behavior:"smooth"

    });



}










// ===============================
// GENERATE TICKET IMAGE
// ===============================

function generateTicketImage(){


    if(!currentOrder){

        alert("Please place your order first");

        return;

    }



    const ticket = document.querySelector(".ticket");



    if(!ticket){

        alert("Ticket not found");

        return;

    }




    html2canvas(ticket, {

        scale:3

    })

    .then(canvas => {



        const image = canvas.toDataURL("image/png");



        const link = document.createElement("a");


        link.href = image;


        link.download = "Kamotas-Order-Ticket.png";


        link.click();





        alert(
        "Ticket created successfully. Now share the image on WhatsApp."
        );



    })

    .catch(error => {


        console.log(error);


        alert("Failed to create ticket image");


    });



}


            // MOBILE SHARE

            if(navigator.share){



                navigator.share({


                    title:"Kamotas Chapati Order",


                    text:"Kamotas Chapati Order Ticket",


                    files:[file]


                })

                .catch(error => {

                    console.log(error);

                });





            }



            else{


                // DESKTOP FALLBACK


                const link = document.createElement("a");


                link.download = "Kamotas-Order-Ticket.png";


                link.href = canvas.toDataURL();


                link.click();



                alert(
                "Ticket image created. Share it on WhatsApp."
                );


            }





        });



    });



}
