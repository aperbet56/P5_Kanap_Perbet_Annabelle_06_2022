// Création d'une variable stockant les données de l'API dans un tableau
let products = [];

/**
 * Déclaration de la fonction asynchrone fetchProducts
 * Envoi d'une requête HTTP de type GET grâce à fetch
 * Stockage des données de l'API dans la variable products
 */
const fetchProducts = async () => {
    await fetch(`http://localhost:3000/api/products`)
    .then(function(res) {
        if(res.ok) {
            return res.json();
        }
    })
    .then(function(value) { 
        products = value;
        console.log(products);
    })
    .catch(function(err) {
        // Affichage d'un message d'erreur dans la console
        console.log("Désolé, une erreur est survenue sur le serveur."); 
    });
};

// Déclaration de la fonction asynchrone productsDisplay pour gérer l'affichage des produits
const productsDisplay = async () => {
    await fetchProducts();
    
    // Utilisation de la boucle for...in afin d'itérer sur chaque produit présent dans l'API
    for(let i in products) {

       // Création et insertion de l'élément <a> dans le DOM
       let itemLink = document.createElement("a")
       itemLink.setAttribute("href", `product.html?id=${products[i]._id}`); 
       document.querySelector(".items").appendChild(itemLink);

       // Création et insertion de l'élément <article> dans le DOM
       let itemArticle = document.createElement("article");
       itemLink.appendChild(itemArticle);

       // Création et insertion de l'élément <img> dans le DOM
       let itemImg = document.createElement("img"); 
       itemImg.setAttribute("src", products[i].imageUrl);
       itemImg.setAttribute("alt", products[i].altTxt);
       itemArticle.appendChild(itemImg);

       // Création et insertion de l'élément <h3> dans le DOM
       let itemTitle = document.createElement("h3");
       itemTitle.classList.add("productName");
       itemTitle.textContent = products[i].name;
       itemArticle.appendChild(itemTitle);

       // Création et insertion de l'élément <p> dans le DOM
       let itemText = document.createElement("p");
       itemText.classList.add("productDescription"); 
       itemText.textContent = products[i].description;
       itemArticle.appendChild(itemText);
    }
};
// Appel de la fonction productsDisplay()
productsDisplay();