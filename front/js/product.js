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

// Déclaration d'une fonction fléchée asynchrone stockée dans la constante displayCurrentProduct pour l'affichage du produit
const displayCurrentProduct = async() => {
    await fetchProduct();

    // Ajout des différents éléments dans le DOM
    let itemImg = document.createElement("img");
    itemImg.setAttribute("src", product.imageUrl);
    itemImg.setAttribute("alt", product.altTxt);
    document.querySelector(".item__img").appendChild(itemImg);

    let itemTitle = document.querySelector("#title");
    itemTitle.textContent = product.name;
   
    itemPrice.textContent = product.price;
   
    let itemText = document.querySelector("#description");
    itemText.textContent = product.description;
    
    colorsOptions(); // Appel de la constante pour le choix des couleurs
};

// Appel de la constante pour l'affichage du produit sur la page
displayCurrentProduct(); 

// Déclaration d'une fonction fléchée stockée dans la constante colorsOptions pour le choix des couleurs
const colorsOptions = () => {
     
    // Utilisation de la boucle for...of pour parcourir le tableau des couleurs
     for (let color of product.colors) {
        let colorChoice = document.createElement("option");
        colorChoice.setAttribute("value", color);
        colorChoice.textContent = color;
        colors.appendChild(colorChoice);
    }
};

// Déclaration d'une fonction fléchée stockée dans la constante addToCart s'occupant de gérer le panier
const addToCart = () => {

    // Récupération du bouton "Ajouter au panier"
    let btnCart = document.querySelector("#addToCart");
   
    //Ecoute de l'événement click sur le bouton "Ajouter au panier"
    btnCart.addEventListener("click", () => {

        // Création de variables récupérant les valeurs de couleur et de quantité choisies
        let colorSelected = colors.value;
        console.log("Couleur du canapé : " + colorSelected);

        let quantitySelected = quantity.value;
        console.log("Quantité souhaitée : " + quantitySelected);

        // variable stockant le prix à payer selon la quantité voulue
        let priceAccordingToQuantity = (product.price * quantitySelected);
        console.log("Prix à payer selon la quantité choisie : " + priceAccordingToQuantity +" €");

        // Condition vérifiant si la couleur et la quantité choisies sont conformes 
        if (colorSelected !== undefined && colorSelected !== "" && quantitySelected > 0 && quantitySelected <= 100) {
    
            // Création d'un objet productSelected correspondant à la selection du client qui sera ajouté au panier
            let productSelected = {
                id: product._id,
                name: product.name,
                color: colorSelected,
                quantity: Number(quantitySelected)
            };
            console.log(productSelected);
            alert("Votre produit a bien été ajouté au panier"); 

            /*const popupConfirmation = () => {
                if (window.confirm(`Votre commande de ${quantitySelected} canapé(s) ${product.name} de couleur ${colorSelected} a bien été ajouté au panier. Pour consulter le panier, cliquez sur OK. Pour revenir à la page d'accueil, veuillez cliquer sur ANNULER`)) {
                    window.location.href = "cart.html";
                } else {
                    window.location.href = "index.html";
                }
            };*/
            
            // Initialisation du localStorage
            let basket = JSON.parse(localStorage.getItem("productSelected"));

            // Si le localStorage est vide, on y ajoute le produit sélectionné 
            if (basket === null) {
                basket = [];
                basket.push(productSelected);
                localStorage.setItem("productSelected", JSON.stringify(basket));
                console.table(basket);
                //popupConfirmation();

            // Si le localStorage contient déjà un produit ou plus
            } else if (basket !== null) {
                
                // Vérification si un produit identique (même id et même couleur) est déjà présent dans le localStorage
                let foundProduct = basket.find(p => p.id === product._id && p.color === colorSelected);
                
                // Si le produit commandé est identique (même id et même couleur), on incrémente la quantité
                if (foundProduct) {
                    //foundProduct.quantity += productSelected.quantity;
                    let newQuantity = Number(productSelected.quantity) + Number(foundProduct.quantity);
                    foundProduct.quantity = newQuantity;
                    localStorage.setItem("productSelected", JSON.stringify(basket));
                    console.table(basket);
                    //popupConfirmation();

                // Si le produit commandé n'est pas identique, on l'ajoute au localStorage
                } else {
                    basket.push(productSelected);
                    localStorage.setItem("productSelected", JSON.stringify(basket));
                    console.table(basket);
                    //popupConfirmation();
                }
            }
        } else {
            // Apparition d'un message d'erreur
            alert ("Veuillez choisir une couleur et/ou une quantité comprise entre 1 et 100");
        }
    });
};

// Appel de la fonction stockée dans la constante addToCart
addToCart();
