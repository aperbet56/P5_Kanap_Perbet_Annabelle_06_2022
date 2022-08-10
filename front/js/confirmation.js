// URLSearchParams : récupération de l'orderID
var str = window.location.href; 
var url = new URL(str);
var search_params = new URLSearchParams(url.search);
if (search_params.has("orderId")) { 
    var orderId = search_params.get("orderId");
    console.log(`Voici le numéro de votre commande : ${orderId}`);
}

// Récupération de la span contenant le numéro de commande
let orderNumber = document.querySelector("#orderId");
orderNumber.textContent = `${orderId}`;

// Vider le localStorage
localStorage.clear();
