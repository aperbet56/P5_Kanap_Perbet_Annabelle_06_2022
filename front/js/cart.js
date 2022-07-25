// Récupération du panier 
let basket = JSON.parse(localStorage.getItem("productSelected"));
console.log(basket);

let product = {};

// Déclaration d'une fontion fléchée ayant pour paramètre le panier stockée dans la constante getProductsInLS pour l'affichage des produits du localStorage
const displayProductInLS = async(basket) => {
    
    if (basket === null || basket === 0) {
        const emptyCartItems = document.querySelector("#cart__items");
        emptyCartItems.innerHTML = `<p>Votre panier est vide</p>`;
    } else {

        // boucle for qui va parcourir le panier et l'incrémenter lorsque le client souhaite ajouter un produit
        for (let i = 0; i < basket.length; i++) {
            await fetch(`http://localhost:3000/api/products/${basket[i].id}`) // Récupération des données manquantes des produits présents dans le localStorage
            .then(function(res) {
                if(res.ok) {
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

            // Ajout des différents éléments dans le DOM
            let itemArticle = document.createElement("article");
            itemArticle.classList.add("cart__item");
            itemArticle.setAttribute("data-id", `${basket[i].id}`);
            itemArticle.setAttribute("data-color", `${basket[i].color}`);
            document.querySelector("#cart__items").appendChild(itemArticle);

            let itemDivImg = document.createElement("div");
            itemDivImg.classList.add("cart__item__img");
            itemArticle.appendChild(itemDivImg);

            let itemImg = document.createElement("img");
            itemImg.setAttribute("src", product.imageUrl);
            itemImg.setAttribute("alt", product.altTxt);
            itemDivImg.appendChild(itemImg);

            let itemDivContent = document.createElement("div");
            itemDivContent.classList.add("cart__item__content");
            itemArticle.appendChild(itemDivContent);

            let itemDivDescription = document.createElement("div");
            itemDivDescription.classList.add("cart__item__content__description");
            itemDivContent.appendChild(itemDivDescription);

            let itemTitle = document.createElement("h2");
            itemTitle.textContent = `${basket[i].name}`;
            itemDivDescription.appendChild(itemTitle);

            let itemColor = document.createElement("p");
            itemColor.textContent = `${basket[i].color}`;
            itemDivDescription.appendChild(itemColor);

            let itemPrice = document.createElement("p");
            let priceAccordingToQuantity = (product.price * basket[i].quantity) 
            itemPrice.textContent = priceAccordingToQuantity + "€";
            itemDivDescription.appendChild(itemPrice);

            let itemDivSettings = document.createElement("div");
            itemDivSettings.classList.add("cart__items__content__settings");
            itemArticle.appendChild(itemDivSettings);

            let itemDivSettingsQuantity = document.createElement("div");
            itemDivSettingsQuantity.classList.add("cart__item__content__settings__quantity");
            itemDivSettings.appendChild(itemDivSettingsQuantity);

            let itemQuantity = document.createElement("p");
            itemQuantity.textContent = "Qté : ";
            itemDivSettingsQuantity.appendChild(itemQuantity);

            let itemInput = document.createElement("input");
            itemInput.classList.add("itemQuantity");
            itemInput.setAttribute("type", "number");
            itemInput.setAttribute("name", itemQuantity);
            itemInput.setAttribute("min", "1")
            itemInput.setAttribute("max", "100");
            itemInput.setAttribute("value", `${basket[i].quantity}`);
            itemDivSettingsQuantity.appendChild(itemInput);

            let itemDivSettingsDelete = document.createElement("div");
            itemDivSettingsDelete.classList.add("cart__item__content__settings__delete");
            itemDivSettings.appendChild(itemDivSettingsDelete);

            let deleteItem = document.createElement("p");
            deleteItem.classList.add("deleteItem");
            deleteItem.textContent = "Supprimer";
            itemDivSettingsDelete.appendChild(deleteItem);
        }
    }
    // Appel des différentes fonctions fléchées stockée dans des constantes
    getNumberProduct(basket);
    getTotalPrice(basket);
    quantityChange(basket);
    removeProduct(basket);
};

// Appel de la constante displayProductInLS contenant une fonction fléchée asynchrone
displayProductInLS(basket);

// Fonction calcul de la quantité totale de produits dans le panier 
const getNumberProduct = (basket) => {
   
    // Je fixe une quantité de départ à zéro
    let numberProduct = 0;

    // Boucle for qui parcourt le panier
    for (let i = 0; i < basket.length; i++) {
        numberProduct += basket[i].quantity;
    }

    // Insertion de la quantité totale dans le DOM
    document.querySelector("#totalQuantity").textContent = numberProduct;
    
    // Je retourne le nombre de produit commandé
    return numberProduct;
};

// Fonction calcul du prix total à payer 
const getTotalPrice = (basket) => {
    
    // Je fixe un prix de départ à zéro
    let orderTotalPrice = 0;

    // Boucle for qui parcourt le panier
    for (let i = 0; i < basket.length; i++) {
        orderTotalPrice += product.price * basket[i].quantity;
    }

    // Insertion du prix total dans le DOM
    document.querySelector("#totalPrice").textContent = orderTotalPrice;
    
    // Je retourne le prix total à payer
    return orderTotalPrice;
};

// Fonction modifier la quantité du panier ayant pour paramètre le panier
const quantityChange = (basket) => {
    
    // Récupération de tous les inputs ayant la class itemQuantity dans la variable
    let changeInputQuantity = document.querySelectorAll(".itemQuantity");

    changeInputQuantity.forEach(input => {

        // Ecoute de l'événement "change" sur les inputs
        input.addEventListener("change", (e) => {
            e.preventDefault();

            // Recherche de l'article contenant le champ (indiquant la quantité) modifié et récupération des informations correspondantes
            let modifyInput = e.target.closest("article");
            let idValue = modifyInput.dataset.id;
            let colorValue = modifyInput.dataset.color;
            let quantityValue = e.target.value;

            // Mise en place d'une condition pour la modification de la quantité
            if (quantityValue > 0 && quantityValue <= 100) {

                // Boucle for qui parcourt le panier
                for (let i = 0; i < basket.length; i++) {
                    if (basket[i].id === idValue && basket[i].color === colorValue) {
                       
                        // La quantité du produit devient le nouveau chiffre présent dans l'input
                        basket[i].quantity = Number(quantityValue);
                
                        // Mise à jour de la quantité dans le localStorage et rechargement de la page
                        localStorage.setItem("productSelected",JSON.stringify(basket));
                        alert(`La quantité de canapé : ${basket[i].name} de couleur ${colorValue} a été modifiée dans votre panier !`)
                        window.location.reload();
                        console.table(basket);
                   }
                } 
            } else {
                // Appartion d'un message d'erreur
                alert("Veuillez choisir une quantité comprise entre 1 et 100")
            }
        });
    });
};

// Fonction suppression d'un produit du panier avec le panier en paramètre 
const removeProduct = (basket) => {

    // Récupération de tous les boutons "Supprimer" ayant la class deleteItem dans la variable deleteBtn
    let deleteProductItem = document.querySelectorAll(".deleteItem");

    deleteProductItem.forEach(btn => {

        // Ecoute de l'événement "click" sur les boutons "supprimer"
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            deleteConfirmation = window.confirm("Êtes-vous sûr(e) de vouloir supprimer ce produit du panier ?");
            
            // Si la suppression du produit est confirmé par l'internaute
            if (deleteConfirmation == true) {

                // Recherche l'article comprenat le bouton "Supprimer" qui a été cliqué
                let deleteArticle = e.target.closest("article");
                let idValue = deleteArticle.dataset.id;
                let colorValue = deleteArticle.dataset.color;

                // Méthode filter : recherche du canapé ayant l'id et la couleur du produit à supprimer
                basket = basket.filter((p) => !(p.id === idValue && p.color == colorValue));

                // Mise à jour du LocalStorage et rechargement de la page
                localStorage.setItem("productSelected",JSON.stringify(basket));
                window.location.reload();
                console.table(basket);
            };
        });
    });
};