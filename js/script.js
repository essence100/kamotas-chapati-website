// ===============================
// CREATE QR CODE
// ===============================


function createQRCode(){


    if(!currentOrder){

        return;

    }



    const qr = document.getElementById("qrcode");



    if(!qr){

        return;

    }



    // CLEAR OLD QR

    qr.innerHTML = "";





    new QRCode(qr,{


        text:

`KAMOTAS CHAPATI

Order:
${currentOrder.orderNumber}

Customer:
${currentOrder.name}

Meal:
${currentOrder.food}

Phone:
+255782722871`,



        width:90,


        height:90


    });



}
