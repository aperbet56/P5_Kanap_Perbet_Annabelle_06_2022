// Création d'une variable stockant les données de l'API dans un tableau
let products = []

/**
 * Déclaration d'une fonction fléchée asynchrone stockée dans la constante fetchProducts
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

// Déclaration d'une fonction fléchée asynchrone stokée dans la constante productsDisplay pour gérer l'affichage des produits
const productsDisplay = async () => {
    await fetchProducts();
    
    // Utilisation de la boucle for...in afin d'itérer sur chaque produit présent dans l'API
    for(let i in products) {

       /**
        * Création de l'élément <a>
        * Ajout de l'attribut href permettant d'afficher un produit suivant son id
        * Insertion du nouvel élément <a>
        */ 
       let itemLink = document.createElement("a")
       itemLink.setAttribute("href", `product.html?id=${products[i]._id}`); 
       document.querySelector(".items").appendChild(itemLink);

       /**
        * Création de l'élément <article>
        * Insertion du nouvel élément <article>
        */
       let itemArticle = document.createElement("article");
       itemLink.appendChild(itemArticle);

       /**
        * Création de l'élément <img>
        * Ajout des attributs src et alt et de leur contenu
        * Insertion du nouvel élément <img>
        */
       let itemImg = document.createElement("img"); 
       itemImg.setAttribute("src", products[i].imageUrl);
       itemImg.setAttribute("alt", products[i].altTxt);
       itemArticle.appendChild(itemImg);

       /**
        * Création de l'élément <h3>
        * Ajout de la class "productName"
        * Ajout du titre sous forme de texte
        * Insertion du nouvel élément <h3>
        */
       let itemTitle = document.createElement("h3");
       itemTitle.classList.add("productName");
       itemTitle.textContent = products[i].name;
       itemArticle.appendChild(itemTitle);

       /**
        * Création de l'élément <p>
        * Ajout de la class "productDescription"
        * Ajout du contenu de la description
        * Insertion de l'élément <p>
        */
       let itemText = document.createElement("p");
       itemText.classList.add("productDescription"); 
       itemText.textContent = products[i].description;
       itemArticle.appendChild(itemText);
    }
};

// Appel de la constante productsDisplay() contenant la fonction fléchée pour permettre l'affichage des produits sur la page d'accueil
productsDisplay(); 