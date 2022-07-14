// URLSearchParams
var str = window.location.href; // Récupération de l’URL du page courante
var url = new URL(str);
var search_params = new URLSearchParams(url.search);
if(search_params.has("id")) { // Utilisation de la méthode has() pour vérifier si le paramètre placé entre parenthèses existe dans l’URL
    var idProduct = search_params.get("id") // La méthode get() retourne la valeur associée au paramètre de recherche donné.
    console.log(`Voici l'id du canapé sélectionné : ${idProduct}`);
}

// variable qui va stocker les données renvoyées par l'API
let product = {};

let colors = document.querySelector("#colors");
let quantity = document.querySelector("#quantity");
let itemPrice = document.querySelector("#price");

/**
 * Déclaration d'une fonction fléchée asynchrone stockée dans la constante fetchProducts
 * Envoi d'une requête HTTP de type GET grâce à fetch
 * Stockage des données de l'API dans la variable product
 */
 const fetchProduct = async() => {
    await fetch(`http://localhost:3000/api/products/${idProduct}`) // Récupération des données du produit selon son id
    .then(function(res) {
        if(res.ok){
            return res.json(); 
        }
    })
    .then (function(value) { 
        product = value;
        console.log(product);
    })
    .catch(function(err) {
        console.log("Désolé, une erreur est survenue sur le serveur."); // Affiche le message d'erreur dans la console
    });
};

