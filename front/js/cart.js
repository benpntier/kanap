function updateQuantity(event) {
    let totalQuantity = parseInt(document.getElementById("totalQuantity").textContent);
    let newQuantity = event.target.value - event.target.oldValue;
    totalQuantity += newQuantity;
    document.getElementById("totalQuantity").textContent = totalQuantity;
    event.target.oldValue = event.target.value;

    // find product id and color
    let productArticle = event.target.closest(".cart__item")
    productId = productArticle.dataset.id;
    productColor = productArticle.dataset.color;

    // update total price
    let totalPrice = parseInt(document.getElementById("totalPrice").textContent);
    price = document.querySelector("[data-id='"+productId+"'] .cart__item__content__description p:nth-of-type(2)").textContent;
    price = price.slice(0, price.length - 1);
    totalPrice += newQuantity*price;
    document.getElementById("totalPrice").textContent = totalPrice;

    // save new quantity to localStorage
    let cartJSON = JSON.parse(window.localStorage.getItem("cart"));
    cartJSON.find(p => p.id === productId && p.color === productColor).quantity += newQuantity;
    window.localStorage.setItem("cart", JSON.stringify(cartJSON));
}

function addCartInformation(cartJSON, productsData) {

    let totalQuantity = 0;
    let totalPrice = 0;

    for (productJSON of cartJSON) {
        productData = productsData.find(p => p._id === productJSON.id);

        const productImg = document.createElement("img");
        productImg.src = productData.imageUrl;
        productImg.alt = productData.altTxt;
    
        const productImgDiv = document.createElement("div");
        productImgDiv.className = "cart__item__img";
        productImgDiv.appendChild(productImg);
    
        const productName = document.createElement("h2");
        productName.textContent = productData.name;
        
        const productColor = document.createElement("p");
        productColor.textContent = productJSON.color;
    
        const productPrice = document.createElement("p");
        productPrice.textContent = productData.price + "€";
    
        const cartItemContentDescription = document.createElement("div");
        cartItemContentDescription.className = "cart__item__content__description";
        cartItemContentDescription.appendChild(productName);
        cartItemContentDescription.appendChild(productColor);
        cartItemContentDescription.appendChild(productPrice);
    
        const quantityLabel = document.createElement("p");
        quantityLabel.textContent = "Qté : ";
    
        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.className = "itemQuantity";
        quantityInput.min = 1;
        quantityInput.max = 100;
        quantityInput.value = productJSON.quantity;
        quantityInput.oldValue = productJSON.quantity;
        quantityInput.onchange = updateQuantity;
    
        const cartItemContentSettingsQuantity = document.createElement("div");
        cartItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";
        cartItemContentSettingsQuantity.appendChild(quantityLabel);
        cartItemContentSettingsQuantity.appendChild(quantityInput);
    
        const deleteItemLabel = document.createElement("p");
        deleteItemLabel.className = "deleteItem";
        deleteItemLabel.textContent = "Supprimer";
    
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

        totalQuantity += productJSON.quantity;
        totalPrice += productData.price;
    }

    document.getElementById("totalQuantity").textContent = totalQuantity;
    document.getElementById("totalPrice").textContent = totalPrice;
}

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
    let cartJSON = JSON.parse(window.localStorage.getItem("cart"));
    fetchData(cartJSON);
};