// URL search_params : récupération de l'orderID
var str = window.location.href; // Récupération de l’URL du page courante
var url = new URL(str);
var search_params = new URLSearchParams(url.search);
if (search_params.has("orderId")) { // Utilisation de la méthode has() pour vérifier si le paramètre placé entre parenthèses existe dans l’URL
    var orderId = search_params.get("orderId") // La méthode get() retourne la valeur associée au paramètre de recherche donné.
    console.log(`Voici le numéro de votre commande : ${orderId}`);
}

// Récupération de la span contenant le numéro de commande
let orderNumber = document.querySelector("#orderId");
orderNumber.textContent = `${orderId}`;

// Vider le localStorage
localStorage.clear();
