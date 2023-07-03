// Mettre à jour la quantité et recalculer le prix total
function updateQuantity(event) {

    // Si la quantité saisie est à 0
    if (event.currentTarget.value == 0) {
        // Simuler un clic sur le bouton "Supprimer"
        document.querySelector(".deleteItem").click();

    } else {
        // Mettre à jour la quantité totale
        let totalQuantity = parseInt(document.getElementById("totalQuantity").textContent);
        let newQuantity = event.currentTarget.value - event.currentTarget.oldValue;
        totalQuantity += newQuantity;
        document.getElementById("totalQuantity").textContent = totalQuantity;
        event.currentTarget.oldValue = event.currentTarget.value;

        // Trouver l'ID et la couleur du produit
        let productArticle = event.currentTarget.closest(".cart__item")
        productId = productArticle.dataset.id;
        productColor = productArticle.dataset.color;

        // Mettre à jour le prix total
        let totalPrice = parseInt(document.getElementById("totalPrice").textContent);
        price = parseFloat(document.querySelector("[data-id='"+productId+"'][data-color='"+productColor+"'] [price]").textContent);
        totalPrice += newQuantity*price;
        document.getElementById("totalPrice").textContent = totalPrice;

        // Enregistrer la nouvelle quantité dans le local storage
        let cartJSON = JSON.parse(window.localStorage.getItem("cart"));
        cartJSON.find(p => p.id === productId && p.color === productColor).quantity += newQuantity;
        window.localStorage.setItem("cart", JSON.stringify(cartJSON));
    }
}

// Enlever le produit du panier
function removeProduct(event) {

    if (window.confirm("Voulez-vous supprimer ce produit ?")) {
        // Trouver l'ID et la couleur du produit
        let productArticle = event.currentTarget.closest(".cart__item")
        productId = productArticle.dataset.id;
        productColor = productArticle.dataset.color;

        // Mettre à jour la quantité totale
        let totalQuantity = parseInt(document.getElementById("totalQuantity").textContent);
        let quantity = document.querySelector("[data-id='"+productId+"'][data-color='"+productColor+"'] .itemQuantity").value;
        totalQuantity -= quantity;
        document.getElementById("totalQuantity").textContent = totalQuantity;

        // Mettre à jour le prix total
        let totalPrice = parseInt(document.getElementById("totalPrice").textContent);
        let price = parseFloat(document.querySelector("[data-id='"+productId+"'][data-color='"+productColor+"'] [price]").textContent);
        totalPrice -= quantity*price;
        document.getElementById("totalPrice").textContent = totalPrice;

        // Enlever le produit du DOM
        productArticle.remove();

        // Enlever le produit du local storage
        let cartJSON = JSON.parse(window.localStorage.getItem("cart"));
        let newCartJSON = cartJSON.filter(p => !(p.id === productId && p.color === productColor));
        window.localStorage.setItem("cart", JSON.stringify(newCartJSON));
    }
}

// Ajouter les informations du panier dans le DOM
function addCartInformation(cartJSON, productsData) {

    let totalQuantity = 0;
    let totalPrice = 0;

    // Pour chaque produit dans le panier
    for (productJSON of cartJSON) {
        // Récupérer les informations du produit
        let productData = productsData.find(p => p._id === productJSON.id);

        // Image
        const productImg = document.createElement("img");
        productImg.src = productData.imageUrl;
        productImg.alt = productData.altTxt;
    
        // Contenant de l'image
        const productImgDiv = document.createElement("div");
        productImgDiv.className = "cart__item__img";
        productImgDiv.appendChild(productImg);
    
        // Nom
        const productName = document.createElement("h2");
        productName.textContent = productData.name;
        
        // Couleur
        const productColor = document.createElement("p");
        productColor.textContent = productJSON.color;
    
        // Prix
        const productPrice = document.createElement("p");
        productPrice.textContent = productData.price + "€";
        productPrice.setAttribute("price","");
    
        // Description
        const cartItemContentDescription = document.createElement("div");
        cartItemContentDescription.className = "cart__item__content__description";
        cartItemContentDescription.appendChild(productName);
        cartItemContentDescription.appendChild(productColor);
        cartItemContentDescription.appendChild(productPrice);
    
        // Quantité (label)
        const quantityLabel = document.createElement("p");
        quantityLabel.textContent = "Qté : ";
    
        // Quantité (champ)
        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.className = "itemQuantity";
        quantityInput.min = 1;
        quantityInput.max = 100;
        quantityInput.value = productJSON.quantity;
        quantityInput.oldValue = productJSON.quantity;
        quantityInput.onchange = updateQuantity;
    
        // Contenant de la quantité
        const cartItemContentSettingsQuantity = document.createElement("div");
        cartItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";
        cartItemContentSettingsQuantity.appendChild(quantityLabel);
        cartItemContentSettingsQuantity.appendChild(quantityInput);
    
        // Bouton Supprimer
        const deleteItemLabel = document.createElement("p");
        deleteItemLabel.className = "deleteItem";
        deleteItemLabel.textContent = "Supprimer";
        deleteItemLabel.onclick = removeProduct;
    
        // Contenant du bouton Supprimer
        const cartItemContentSettingsDelete = document.createElement("div");
        cartItemContentSettingsDelete.className = "cart__item__content__settings__delete";
        cartItemContentSettingsDelete.appendChild(deleteItemLabel);
    
        // Contenant de la quantité et du bouton Supprimer
        const cartItemContentSettings = document.createElement("div")
        cartItemContentSettings.className = "cart__item__content__settings";
        cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);
        cartItemContentSettings.appendChild(cartItemContentSettingsDelete);
    
        // Informations du produit
        const cartItemContent = document.createElement("div");
        cartItemContent.className = "cart__item__content";
        cartItemContent.appendChild(cartItemContentDescription);
        cartItemContent.appendChild(cartItemContentSettings);
    
        // <article>
        const productArticle = document.createElement("article");
        productArticle.className = "cart__item";
        productArticle.dataset.id = productJSON.id;
        productArticle.dataset.color = productJSON.color;
        productArticle.appendChild(productImgDiv);
        productArticle.appendChild(cartItemContent);
    
        // Ajouter au DOM
        document.getElementById("cart__items").appendChild(productArticle);

        // Incrémenter la quantité totale et le prix total
        totalQuantity += productJSON.quantity;
        totalPrice += productJSON.quantity*productData.price;
    }

    // Définir la quantité totale et le prix totale
    document.getElementById("totalQuantity").textContent = totalQuantity;
    document.getElementById("totalPrice").textContent = totalPrice;
}

// Vérifier que les champs du formulaire ne soient pas vides et soient valides
function checkNoError() {

    // Vérification
    if (
        // Champs non vides
        !document.getElementById("firstName").value == "" &&
        !document.getElementById("lastName").value == "" &&
        !document.getElementById("address").value == "" &&
        !document.getElementById("city").value == "" &&
        !document.getElementById("email").value == "" &&

        // Champs valides (pas d'erreur affichée)
        document.getElementById("firstNameErrorMsg").innerText == "" &&
        document.getElementById("lastNameErrorMsg").innerText == "" &&
        document.getElementById("addressErrorMsg").innerText == "" &&
        document.getElementById("cityErrorMsg").innerText == "" &&
        document.getElementById("emailErrorMsg").innerText == ""
    ) {
        // Activer le bouton Commander
        document.getElementById("order").disabled = false;
        
    } else {
        // Désactiver le bouton Commander
        document.getElementById("order").disabled = true;
    }
}

// Vérifier que le champ ne contienne pas de caractère spécial
function checkSpecialCharacter(event) {
    // regex : on accepte uniquement des lettres (de n'importe quelle langue), caractère espace, apostrophe ou tiret
    const regexNoSpecialCharacter = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ '-]+$/;
    if (!regexNoSpecialCharacter.test(event.currentTarget.value)) {
        document.getElementById(event.currentTarget.id+"ErrorMsg").innerText = "/!\\ La saisie n'est pas au bon format";
    } else {
        document.getElementById(event.currentTarget.id+"ErrorMsg").innerText = "";
    }
    checkNoError();
}

// Vérifier que le champ adresse soit correct
function checkAddress(event) {
    // regex : on accepte uniquement des chiffres, lettres (de n'importe quelle langue), caractère espace, apostrophe, tiret, point, esperluette, dièse ou parenthèses
    const regexAddress= /^[0-9a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ '-,.&#()]+$/;
    if (!regexAddress.test(event.currentTarget.value)) {
        document.getElementById("addressErrorMsg").innerText = "/!\\ L'adresse n'est pas au bon format";
    } else {
        document.getElementById("addressErrorMsg").innerText = "";
    }
    checkNoError();
}

// Vérifier que le champ e-mail soit correct et ajouter (ou enlever) un message d'erreur
function checkEmail(event) {
    // source : https://www.w3resource.com/javascript/form/email-validation.php
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!regexEmail.test(event.currentTarget.value)) {
        document.getElementById("emailErrorMsg").innerText = "/!\\ L'adresse e-mail n'est pas au bon format";
    } else {
        document.getElementById("emailErrorMsg").innerText = "";
    }
    checkNoError();
}

// Envoyer la commande
function sendOrder(event) {

    // Créer l'objet contact
    let contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
    }

    // Récupérer le tableau des ID des produits
    let cartJSON = JSON.parse(window.localStorage.getItem("cart"));
    let products = cartJSON.map(p => p.id.toString()); //string array

    // Créer l'objet à envoyer à l'API
    let order = {
        contact,
        products
    }

    // Vérifier la présence des champs
    if (
        contact.hasOwnProperty("firstName") &&
        contact.hasOwnProperty("lastName") &&
        contact.hasOwnProperty("address") &&
        contact.hasOwnProperty("city") &&
        contact.hasOwnProperty("email")
    ) {
        // Requête API POST
        fetch("http://localhost:3000/api/products/order", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(order)
        })
            .then((response) => {
                rjson = response.json();
                return rjson;
            })
            .then((data) => {
                // Rediriger vers la page de confirmation avec le numéro de commande
                cartJSON = [];
                window.localStorage.setItem("cart", JSON.stringify(cartJSON));
                window.location.href = "./confirmation.html?order="+encodeURIComponent(data.orderId);
            });
    }
}

// Récupérer les données des produits de l'API
function fetchData(cartJSON) {
	fetch("http://localhost:3000/api/products")
		.then((response) => {
			return response.json();
		})
		.then((data) => {
            productsData = data;
            addCartInformation(cartJSON, productsData);
		});
}

window.onload = function() {
    // Récupérer le panier du local storage
    let cartJSON = JSON.parse(window.localStorage.getItem("cart"));

    // Ajouter des listeners sur les champs du formulaire pour les vérifier
    document.getElementById("firstName").onchange = checkSpecialCharacter;
    document.getElementById("lastName").onchange = checkSpecialCharacter;
    document.getElementById("address").onchange = checkAddress;
    document.getElementById("city").onchange = checkSpecialCharacter;
    document.getElementById("email").onchange = checkEmail;

    // Désactiver le bouton Commander si les champs du formulaires sont vides (ou mal remplis)
    checkNoError();

    // Récupérer les données des produits de l'API
    fetchData(cartJSON);
};