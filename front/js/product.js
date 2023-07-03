// Tableau des données du produit
let productData = [];

// Ajouter les informations du produit (en paramètre) au DOM
function addProductInfo(product) {

    // Image
    const productImg = document.createElement("img");
    productImg.src = product.imageUrl;
    productImg.alt = product.altTxt;
    document.querySelector(".item__img").appendChild(productImg);

    // Informations du produit
    document.getElementById("title").textContent = product.name;
    document.getElementById("price").textContent = product.price;
    document.getElementById("description").textContent = product.description;

    // Options de couleur
    const colorsList = document.getElementById("colors");
    for (color of product.colors) {
        const option = new Option(color, color);
        colorsList.options.add(option);
    }
}

// Récupérer les données du produit de l'API
function fetchData(id) {
	fetch("http://localhost:3000/api/products/"+id)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			productData = data;
			addProductInfo(productData);
		});
}

// Ajouter un produit au panier (enregistrer ses informations dans le local storage)
function saveToLocalStorage(event) {

    const quantitySelector = document.getElementById("quantity");
    const colorsList = document.getElementById("colors");

    if (quantitySelector.value > 0 && colorsList.selectedIndex > 0) {
        // Récupérer ou créer l'objet panier
        let cartJSON = JSON.parse(window.localStorage.getItem("cart"));
        if (cartJSON === null) {
            cartJSON = [];
        }
    
        // Si le produit est déjà dans le panier (ID et couleur) : on augmente sa quantité
        let alreadyInCart = false;
        for (productJSON of cartJSON) {
            if (productJSON.id == event.currentTarget.productID && productJSON.color == colorsList.value) {
                alreadyInCart = true;
                productJSON.quantity = productJSON.quantity + parseInt(quantitySelector.value);
            }
        }

        // Si le produit n'était pas déjà dans le panier : on l'ajoute
        if (!alreadyInCart) {
            let productObject = {
                id:event.currentTarget.productID,
                color:colorsList.value,
                quantity:parseInt(quantitySelector.value)
            }
            cartJSON.push(productObject)
        }

        // Enregistrer le panier dans le local storage et rediriger vers la page Panier
        window.localStorage.setItem("cart", JSON.stringify(cartJSON));
        window.location='cart.html'
    }
}

// Vérifier que les champs soient remplis pour activer le bouton
function checkFilledFields() {
	if (document.getElementById("quantity").value > 0 && document.getElementById("colors").selectedIndex > 0) {
        document.getElementById("addToCart").disabled = false;
    } else {
        document.getElementById("addToCart").disabled = true;
    }
}

window.onload = function() {
    // Récupérer l'ID du produit de l'URL de la page
    const productURL = new URL(window.location.toLocaleString());
    const productID = productURL.searchParams.get('id');

    // Récupérer les données de l'API
    fetchData(productID);

    // Activer le bouton si les champs sont remplis
    document.getElementById("colors").addEventListener("input", checkFilledFields);
    document.getElementById("quantity").addEventListener("input", checkFilledFields);

    // Bouton "Ajouter au panier"
    cartButton = document.getElementById("addToCart");
    cartButton.onclick = saveToLocalStorage;
    cartButton.productID = productID;
    cartButton.disabled = true;
};