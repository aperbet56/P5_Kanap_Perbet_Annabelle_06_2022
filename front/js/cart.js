// Récupération du panier 
let basket = JSON.parse(localStorage.getItem("productSelected"));
console.log(basket);

// Variable qui va stocker les données non présentes dans le localStorage
let product = {};

// Variable créant un tableau vide qui va être utilisée pour le calcul du prix total
let articles = [];

/**
 * Déclaration de la fonction displayProductInLS permettant l'affichage des produits présents dans le panier
 * @param {Array.<Object>} basket 
 */
const displayProductInLS = async(basket) => { 
    if (basket === null || basket === 0) {
        let emptyCartItems = document.querySelector("#cart__items");
        emptyCartItems.innerHTML = `<p>Votre panier est vide</p>`;
    } else {
        for(let i = 0; i < basket.length; i++) {
            await fetch(`http://localhost:3000/api/products/${basket[i].id}`) // Récupération des données manquantes des produits présents dans le localStorage
            .then(function(res) {
                if(res.ok) {
                    return res.json(); 
                }
            })
            .then(function(value) { 
                product = value; 
                console.log(product);
                articles.push(product);
            })
            .catch(function(err) {
                // Affichage d'un message d'erreur dans la console
                console.log("Désolé, une erreur est survenue sur le serveur."); 
            });

            // Création et insertion de l'élément <article> dans le DOM
            let itemArticle = document.createElement("article");
            itemArticle.classList.add("cart__item");
            itemArticle.setAttribute("data-id", `${basket[i].id}`);
            itemArticle.setAttribute("data-color", `${basket[i].color}`);
            document.querySelector("#cart__items").appendChild(itemArticle);

            // Création et insertion d'un élément <div> dans le DOM
            let itemDivImg = document.createElement("div");
            itemDivImg.classList.add("cart__item__img");
            itemArticle.appendChild(itemDivImg);

            // Création et insertion de l'élément <img> dans le DOM
            let itemImg = document.createElement("img");
            itemImg.setAttribute("src", product.imageUrl);
            itemImg.setAttribute("alt", product.altTxt);
            itemDivImg.appendChild(itemImg);

            // Création et insertion d'un élément <div> dans le DOM
            let itemDivContent = document.createElement("div");
            itemDivContent.classList.add("cart__item__content");
            itemArticle.appendChild(itemDivContent);

            // Création et insertion d'un élément <div> dans le DOM
            let itemDivDescription = document.createElement("div");
            itemDivDescription.classList.add("cart__item__content__description");
            itemDivContent.appendChild(itemDivDescription);

            // Création et insertion de l'élément <h2> dans le DOM
            let itemTitle = document.createElement("h2");
            itemTitle.textContent = `${basket[i].name}`;
            itemDivDescription.appendChild(itemTitle);

            // Création et insertion d'un élément <p> dans le DOM
            let itemColor = document.createElement("p");
            itemColor.textContent = `${basket[i].color}`;
            itemDivDescription.appendChild(itemColor);

            // Création et insertion d'un élément <p> dans le DOM
            let itemPrice = document.createElement("p");
            let priceAccordingToQuantity = (product.price * basket[i].quantity); 
            itemPrice.textContent = priceAccordingToQuantity + "€";
            itemDivDescription.appendChild(itemPrice);

            // Création et insertion d'un élément <div> dans le DOM
            let itemDivSettings = document.createElement("div");
            itemDivSettings.classList.add("cart__items__content__settings");
            itemDivContent.appendChild(itemDivSettings);

            // Création et insertion d'un élément <div> dans le DOM
            let itemDivSettingsQuantity = document.createElement("div");
            itemDivSettingsQuantity.classList.add("cart__item__content__settings__quantity");
            itemDivSettings.appendChild(itemDivSettingsQuantity);

            // Création et insertion d'un élément <p>
            let itemQuantity = document.createElement("p");
            itemQuantity.textContent = "Qté : ";
            itemDivSettingsQuantity.appendChild(itemQuantity);

            // Création et insertion de l'élémemt <input>
            let itemInput = document.createElement("input");
            itemInput.classList.add("itemQuantity");
            itemInput.setAttribute("type", "number");
            itemInput.setAttribute("name", itemQuantity);
            itemInput.setAttribute("min", "1");
            itemInput.setAttribute("max", "100");
            itemInput.setAttribute("value", `${basket[i].quantity}`);
            itemDivSettingsQuantity.appendChild(itemInput);

            // Création et insertion d'un élément <div> dans le DOM
            let itemDivSettingsDelete = document.createElement("div");
            itemDivSettingsDelete.classList.add("cart__item__content__settings__delete");
            itemDivSettings.appendChild(itemDivSettingsDelete);

            // Création et insertion d'un élément <p> dans le DOM
            let deleteItem = document.createElement("p");
            deleteItem.classList.add("deleteItem");
            deleteItem.textContent = "Supprimer";
            itemDivSettingsDelete.appendChild(deleteItem);
        }
    }
    // Appel des différentes fonctions
    getNumberProduct(basket);
    getTotalPrice(basket);
    quantityChange(basket);
    removeProduct(basket);
};
// Appel de la fonction displayProductInLS 
displayProductInLS(basket);

/**
 * Déclaration de la fonction getNumberProduct permettant le calcul de la quantité totale de produit dans le panier
 * @param {Array.<Object>} basket 
 * @returns {Number} la quantité totale de produits présents dans le panier
 */
const getNumberProduct = (basket) => {
    let numberProduct = 0;
    for(let i = 0; i < basket.length; i++) {
        numberProduct += basket[i].quantity;
    }
    document.querySelector("#totalQuantity").textContent = numberProduct;
    return numberProduct;
};

/**
 * Déclaration de la fonction getTotalPrice permettant le calcul du prix total à payer
 * @param {Array.<Object>} basket 
 * @returns {Number} le prix total à payer
 */
const getTotalPrice = (basket) => {
    let orderTotalPrice = 0;
    for(let i = 0; i < basket.length; i++) {
        let productPrice = articles.filter(a => a._id === basket[i].id )[0].price;
        orderTotalPrice += (productPrice * basket[i].quantity); 
    }
    document.querySelector("#totalPrice").textContent = orderTotalPrice;
    return orderTotalPrice;
};

/**
 * Déclaration de la fonction quantityChange permettant de modifier la quantité d'un produit dans le panier
 * @param {Array.<Object>} basket 
 */
const quantityChange = (basket) => {
    
    // Récupération de tous les inputs ayant la class itemQuantity dans la variable changeInputQuantity
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
                for(let i = 0; i < basket.length; i++) {
                    if (basket[i].id === idValue && basket[i].color === colorValue) {
                       
                        // La quantité du produit devient le nouveau chiffre présent dans l'input
                        basket[i].quantity = Number(quantityValue);
                
                        // Mise à jour de la quantité dans le localStorage et rechargement de la page
                        localStorage.setItem("productSelected",JSON.stringify(basket));
                        console.table(basket);
                        alert(`La quantité de canapé : ${basket[i].name} de couleur ${colorValue} a été modifiée dans votre panier !`);
                        window.location.reload();
                    }
                } 
            } else {
                alert("Veuillez choisir une quantité comprise entre 1 et 100")
            }
        });
    });
};

/**
 * Déclaration de la fonction removeProduct permettant la suppression d'un produit du panier 
 * @param {Array.<Object>} basket 
 */
const removeProduct = (basket) => {

    // Récupération de tous les boutons "Supprimer" ayant la class deleteItem dans la variable deleteBtn
    let deleteProductItem = document.querySelectorAll(".deleteItem");
    deleteProductItem.forEach(btn => {

        // Ecoute de l'événement "click" sur les boutons "supprimer"
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            let deleteConfirmation = window.confirm("Êtes-vous sûr(e) de vouloir supprimer ce produit du panier ?");
            
            // Si la suppression du produit est confirmé par l'internaute
            if (deleteConfirmation == true) {

                // Recherche l'article comprenant le bouton "Supprimer" qui a été cliqué
                let deleteArticle = e.target.closest("article");
                let idValue = deleteArticle.dataset.id;
                let colorValue = deleteArticle.dataset.color;

                // Sélection des produits à conserver avec la méthode filter et suppression du produit souhaité avec la logique inversée !==
                basket = basket.filter(p => p.id !== idValue || p.color !== colorValue);

                // Mise à jour du LocalStorage et rechargement de la page
                localStorage.setItem("productSelected",JSON.stringify(basket));
                console.table(basket);
                alert("Le produit a bien été supprimé de votre panier");
                window.location.reload();
            }
        });
    });
};

// Regex 
const regexName = /^[A-Z][A-Za-z\é\è\ê\ô\-]+$/;
const regexAddress = /^(.){2,50}$/;
const regexCity = /^[a-zA-Z',.\s-]{1,25}$/;
const regexEmail = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;

// Récupération des différents imputs
let firstName = document.querySelector("#firstName");
let lastName = document.querySelector("#lastName");
let address = document.querySelector("#address");
let city = document.querySelector("#city");
let email = document.querySelector("#email");

/**
 * Fonction firstNameValidation pour la validation du champ prénom
 * @param {String} firstName 
 */
const firstNameValidation = (firstName) => {
    
    // Ecoute de l'événement "change" sur l'input firstName
    firstName.addEventListener("change", (e) => {
        e.preventDefault();
        if (regexName.test(firstName.value) == false) {
            document.querySelector("#firstNameErrorMsg").textContent = "Veuillez saisir un prénom valide, ex : Pierre";
            return false;
        } else {
            document.querySelector("#firstNameErrorMsg").textContent = " ";
            return true;
        }
    });
};
// Appel de la fonction firstNameValidation
firstNameValidation(firstName);

/**
 * Déclaration de la fonction lastNameValidation pour la validation du champ nom 
 *  @param {String} lastName 
 */
const lastNameValidation = (lastName) => {
   
    // Ecoute de l'événement "change" sur l'input lastName
    lastName.addEventListener("change", (e) => {
        e.preventDefault();
        if (regexName.test(lastName.value) == false) {
            document.querySelector("#lastNameErrorMsg").textContent = "Veuillez saisir un nom valide, ex : Dupont";
            return false;
        } else {
            document.querySelector("#lastNameErrorMsg").textContent = " ";
            return true;
        }
    });
};
// Appel de la fonction lastNameValidation
lastNameValidation(lastName);

/**
 * Déclaration de la fonction addressValidation pour la validation du champ adresse
 * @param {String} address 
 */
const addressValidation = (address) => {
    
    // Ecoute de l'événement "change" sur l'input address
    address.addEventListener("change", (e) => {
        e.preventDefault();
        if (regexAddress.test(address.value) == false) {
            document.querySelector("#addressErrorMsg").textContent = "Veuillez saisir une addresse valide, ex : 10 Avenue des Oliviers";
            return false;
        } else {
            document.querySelector("#addressErrorMsg").textContent = " ";
            return true;
        }
    });
};
 // Appel de la fonction addressValidation
addressValidation(address);

/**
 * Déclaration de la fonction cityValidation pour la validation du champ ville
 * @param {String} city 
 */
const cityValidation = (city) => {
    
    // Ecoute de l'événement "change" sur l'input city
    city.addEventListener("change", (e) => {
        e.preventDefault();
        if (regexCity.test(city.value) == false) {
            document.querySelector("#cityErrorMsg").textContent = "Veuillez saisir une ville valide, ex : Lyon";
            return false;
        } else {
            document.querySelector("#cityErrorMsg").textContent = " ";
            return true;
        }
    });
};
// Appel de la fonction cityValidation
cityValidation(city);

/**
 * Déclaration de la fonction emailValidation pour la validation du champ email
 * @param {String} email 
 */
const emailValidation = (email) => {
    
    // Ecoute de l'événement "change" sur l'input email
    email.addEventListener("change", (e) => {
        e.preventDefault();
        if (regexEmail.test(email.value) == false) {
            document.querySelector("#emailErrorMsg").textContent = "Veuillez saisir un email valide, ex : exemple@contact.com";
            return false;
        } else {
            document.querySelector("#emailErrorMsg").textContent = " ";
            return true;
        }
   });
};
// Appel de la fonction emailValidation
emailValidation(email);

//Déclaration de la fonction SendToServer permettant d'envoyer des données au serveur
const sendToServer = () => {
    
    // Récupération du bouton "Commander !"
    let btnOrder = document.querySelector("#order");

    // Ecoute de l'événement "click" sur le bouton "Commander !"
    btnOrder.addEventListener("click", (e) => {
        e.preventDefault();
        if (basket === null || basket === 0) {
            alert("Votre panier est vide ! Veuillez choisir un ou plusieurs produits avant de remplir le formulaire pour valider votre commande !");
        } // Contrôle de la validité du formulaire 
        else if (regexName.test(firstName.value) == false || regexName.test(lastName.value) == false || regexAddress.test(address.value) == false || regexCity.test(city.value) == false || regexEmail.test(email.value) == false) {
            alert("Malheureusement, nous ne sommes pas en mesure d'enregistrer votre commande : vos informations de contact ne sont pas corrects ! ");
        } else {

            // Création de l'objet contact
            let contact = {
                firstName : firstName.value,
                lastName : lastName.value,
                address : address.value,
                city : city.value,
                email : email.value
            };
            console.log(contact);

            // Enregistrement des données du formulaire dans le localStorage
            localStorage.setItem("contact", JSON.stringify(contact));

            // Création du tableau products
            let products = [];
            for(let i = 0; i < basket.length; i++) {
                products.push(basket[i].id);
                console.table(products);
            }

            // Requête fetch de l'URL de l'API et utilisation de la methode POST
            fetch(`http://localhost:3000/api/products/order`, {
                method : "POST",
                headers : {
                    "Accept" : "application/json;charset=utf-8",
                    "Content-Type" : "application/json;charset=utf-8",
                },
                body : JSON.stringify({contact, products}),
            })
            .then(function(res) {
                if (res.ok) {
                    return res.json();
                }
            })
            .then(function(value) {
                let orderId = value.orderId;
                console.log(orderId);
                alert("Votre commande a bien été validée et enregistrée !");
                window.location.assign(`confirmation.html?orderId=${orderId}`);
            })
            .catch(function(err) {
                // Affiche le message d'erreur dans la console
                console.log("Désolé, une erreur est survenue sur le serveur."); 
            });
        }
    });
};
// Appel de la fonction sendToServer
sendToServer();
