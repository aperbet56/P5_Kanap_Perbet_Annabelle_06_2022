// Création d'une variable stockant les données de l'API dans un tableau
let products = []

/**
 * Déclaration d'une fonction fléchée asynchrone stocké dans la constante fetchProducts
 * Envoi d'une requête HTTP de type GET grâce à fetch
 * Appel de la fonction then() pour récupérer le résultat de la requête au format JSON (ayant vérifié au préalable que la requête s'est bien passée avec res.ok)
 * Récupération de la valeur du résultat JSON dans la fonction then() suivante
 * Appel à une fonction catch() afin de récupérer l'erreur s'il y en a une
 */
const fetchProducts = async () => {
    await fetch(`http://localhost:3000/api/products`)
    .then (function(res) {
        if(res.ok) {
            return res.json();
        }
    })
    .then(function(value) { 
        products = value;
        console.log(products);
    })
    .catch(function(err) {
        console.log("Désolé, une erreur est survenue sur le serveur."); // affiche le message d'erreur dans la console
    });
};
fetchProducts();