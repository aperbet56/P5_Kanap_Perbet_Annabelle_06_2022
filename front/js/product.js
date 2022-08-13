// URLSearchParams
var str = window.location.href; 
var url = new URL(str);
var search_params = new URLSearchParams(url.search);
if(search_params.has("id")) { 
    var idProduct = search_params.get("id");
    console.log(`Voici l'id du canapé sélectionné : ${idProduct}`);
}

// variable qui va stocker les données renvoyées par l'API
let product = {};

let colors = document.querySelector("#colors");
let quantity = document.querySelector("#quantity");

/**
 * Déclaration de la fonction asynchrone fetchProducts
 * Envoi d'une requête HTTP de type GET grâce à fetch
 * Stockage des données de l'API dans la variable product
 */
 const fetchProduct = async() => {
    await fetch(`http://localhost:3000/api/products/${idProduct}`) 
    .then(function(res) {
        if(res.ok){
            return res.json(); 
        }
    })
    .then(function(value) { 
        product = value;
        console.log(product);
    })
    .catch(function(err) {
        // Affichage d'un message d'erreur dans la console
        console.log("Désolé, une erreur est survenue sur le serveur."); 
    });
};

// Déclaration de la fonction asynchrone displayCurrentProduct permettant l'affichage du produit
const displayCurrentProduct = async() => {
    await fetchProduct();

    // Ajout des différents éléments dans le DOM
    let itemImg = document.createElement("img");
    itemImg.setAttribute("src", product.imageUrl);
    itemImg.setAttribute("alt", product.altTxt);
    document.querySelector(".item__img").appendChild(itemImg);

    let itemTitle = document.querySelector("#title");
    itemTitle.textContent = product.name;
   
    let itemPrice = document.querySelector("#price");
    itemPrice.textContent = product.price;
   
    let itemText = document.querySelector("#description");
    itemText.textContent = product.description;
    
    // Appel de la fonction colorsOptions 
    colorsOptions(); 
};
// Appel de la fonction displayCurrentProduct
displayCurrentProduct(); 

// Déclaration de la fonction colorsOptions permettant le choix des couleurs
const colorsOptions = () => {
     
    // Utilisation de la boucle for...of pour parcourir le tableau des couleurs
    for(let color of product.colors) {
        let colorChoice = document.createElement("option");
        colorChoice.setAttribute("value", color);
        colorChoice.textContent = color;
        colors.appendChild(colorChoice);
    }
};

// Déclaration de la fonction addToCart s'occupant de gérer le panier
const addToCart = () => {

    // Récupération du bouton "Ajouter au panier"
    let btnCart = document.querySelector("#addToCart");
   
    //Ecoute de l'événement click sur le bouton "Ajouter au panier"
    btnCart.addEventListener("click", (e) => {
        e.preventDefault();

        // Création de variables récupérant les valeurs de couleur et de quantité choisies
        let colorSelected = colors.value;
        let quantitySelected = quantity.value;

        // Condition vérifiant si la couleur et la quantité choisies sont conformes 
        if (colorSelected !== "" && quantitySelected > 0 && quantitySelected <= 100) {
    
            // Création d'un objet productSelected contenant les données du produit sélectionné par le client
            let productSelected = {
                id: product._id,
                name: product.name,
                color: colorSelected,
                quantity: Number(quantitySelected)
            };
            console.log(productSelected);

            // Initialisation du localStorage
            let basket = JSON.parse(localStorage.getItem("productSelected"));

            // Si le localStorage est vide, on y ajoute le produit sélectionné 
            if (basket == null) {
                basket = [];
                basket.push(productSelected);
                localStorage.setItem("productSelected", JSON.stringify(basket));
                alert(`Votre commande de ${quantitySelected} canapé(s) ${product.name} de couleur ${colorSelected} a bien été ajouté au panier. Pour consulter votre panier, cliquez sur le lien Panier`); 
                console.table(basket);
    
            // Si le localStorage contient déjà un produit ou plus
            } else if (basket != null) {
                
                // Vérification si un produit identique (même id et même couleur) est déjà présent dans le panier
                let foundProduct = basket.find(p => p.id === product._id && p.color === colorSelected);
                
                // Si le produit commandé est identique (même id et même couleur), on incrémente la quantité
                if (foundProduct) {
                    let totalNewQuantity = Number(productSelected.quantity) + Number(foundProduct.quantity);
                    foundProduct.quantity = totalNewQuantity;
                    localStorage.setItem("productSelected", JSON.stringify(basket));
                    console.table(basket);

                // Si le produit commandé n'est pas strictement identique, on l'ajoute au panier et dans le localStorage
                } else {
                    basket.push(productSelected);
                    localStorage.setItem("productSelected", JSON.stringify(basket));
                    alert(`Votre commande de ${quantitySelected} canapé(s) ${product.name} de couleur ${colorSelected} a bien été ajouté au panier. Pour consulter votre panier, cliquez sur le lien Panier`);
                    console.table(basket); 
                }
            }
        } else {
            alert ("Veuillez choisir une couleur et/ou une quantité comprise entre 1 et 100");
        }
    });
};
// Appel de la fonction addToCart
addToCart();
