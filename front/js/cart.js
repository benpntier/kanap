function addCartInformation(productJSON, productData) {

    const productImg = document.createElement("img");
    productImg.src = productData.imageUrl;
    productImg.alt = productData.altTxt;

    const productImgDiv = document.createElement("div");
    productImgDiv.className = "cart__item__img";
    productImgDiv.appendChild(productImg);

    const productName = document.createElement("h2");
    productName.innerText = productData.name;
    
    const productColor = document.createElement("p");
    productColor.innerText = productJSON.color;

    const productPrice = document.createElement("p");
    productPrice.innerText = productData.price + "€";

    const cartItemContentDescription = document.createElement("div");
    cartItemContentDescription.className = "cart__item__content__description";
    cartItemContentDescription.appendChild(productName);
    cartItemContentDescription.appendChild(productColor);
    cartItemContentDescription.appendChild(productPrice);

    const quantityLabel = document.createElement("p");
    quantityLabel.innerText = "Qté : ";

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.className = "itemQuantity";
    quantityInput.min = 1;
    quantityInput.max = 100;
    quantityInput.value = productJSON.quantity;

    const cartItemContentSettingsQuantity = document.createElement("div");
    cartItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";
    cartItemContentSettingsQuantity.appendChild(quantityLabel);
    cartItemContentSettingsQuantity.appendChild(quantityInput);

    const deleteItemLabel = document.createElement("p");
    deleteItemLabel.className = "deleteItem";
    deleteItemLabel.innerText = "Supprimer";

    const cartItemContentSettingsDelete = document.createElement("div");
    cartItemContentSettingsDelete.className = "cart__item__content__settings__delete";
    cartItemContentSettingsDelete.appendChild(deleteItemLabel);

    const cartItemContentSettings = document.createElement("div")
    cartItemContentSettings.className = "cart__item__content__settings";
    cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);
    cartItemContentSettings.appendChild(cartItemContentSettingsDelete);

    const cartItemContent = document.createElement("div");
    cartItemContent.className = "cart__item__content";
    cartItemContent.appendChild(cartItemContentDescription);
    cartItemContent.appendChild(cartItemContentSettings);

    const productArticle = document.createElement("article");
    productArticle.className = "cart__item";
    productArticle.dataset.id = productJSON.id;
    productArticle.dataset.color = productJSON.color;

    productArticle.appendChild(productImgDiv);
    productArticle.appendChild(cartItemContent);

    document.getElementById("cart__items").appendChild(productArticle);
}

function fetchData(productJSON) {
	fetch("http://localhost:3000/api/products/"+productJSON.id)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
            productData = data;
            addCartInformation(productJSON, productData);
		});
}

window.onload = function() {
    let cartJSON = JSON.parse(window.localStorage.getItem("cart"));

    for (productJSON of cartJSON) {
        fetchData(productJSON);
    }
};