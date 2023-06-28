function updateQuantity(event) {
    // update total quantity
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
    price = parseFloat(document.querySelector("[data-id='"+productId+"'][data-color='"+productColor+"'] [price]").textContent);
    totalPrice += newQuantity*price;
    document.getElementById("totalPrice").textContent = totalPrice;

    // save new quantity to localStorage
    let cartJSON = JSON.parse(window.localStorage.getItem("cart"));
    cartJSON.find(p => p.id === productId && p.color === productColor).quantity += newQuantity;
    window.localStorage.setItem("cart", JSON.stringify(cartJSON));
}

function removeProduct(event) {

    if (window.confirm("Voulez-vous supprimer ce produit ?")) {
        // find product id and color
        let productArticle = event.target.closest(".cart__item")
        productId = productArticle.dataset.id;
        productColor = productArticle.dataset.color;

        // update total quantity
        let totalQuantity = parseInt(document.getElementById("totalQuantity").textContent);
        let quantity = document.querySelector("[data-id='"+productId+"'][data-color='"+productColor+"'] .itemQuantity").value;
        totalQuantity -= quantity;
        document.getElementById("totalQuantity").textContent = totalQuantity;

        // update total price
        let totalPrice = parseInt(document.getElementById("totalPrice").textContent);
        let price = parseFloat(document.querySelector("[data-id='"+productId+"'][data-color='"+productColor+"'] [price]").textContent);
        totalPrice -= quantity*price;
        document.getElementById("totalPrice").textContent = totalPrice;

        // remove product from DOM
        productArticle.remove();

        // remove product from local storage
        let cartJSON = JSON.parse(window.localStorage.getItem("cart"));
        let newCartJSON = cartJSON.filter(p => !(p.id === productId && p.color === productColor));
        window.localStorage.setItem("cart", JSON.stringify(newCartJSON));
    }
}

function addCartInformation(cartJSON, productsData) {

    let totalQuantity = 0;
    let totalPrice = 0;

    for (productJSON of cartJSON) {
        let productData = productsData.find(p => p._id === productJSON.id);

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
        productPrice.setAttribute("price","");
    
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
        deleteItemLabel.onclick = removeProduct;
    
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
        totalPrice += productJSON.quantity*productData.price;
    }

    document.getElementById("totalQuantity").textContent = totalQuantity;
    document.getElementById("totalPrice").textContent = totalPrice;
}

function checkNoError() {
    if (
        !document.getElementById("firstName").value == "" &&
        !document.getElementById("lastName").value == "" &&
        !document.getElementById("address").value == "" &&
        !document.getElementById("city").value == "" &&
        !document.getElementById("email").value == "" &&
        document.getElementById("firstNameErrorMsg").innerText == "" &&
        document.getElementById("lastNameErrorMsg").innerText == "" &&
        document.getElementById("addressErrorMsg").innerText == "" &&
        document.getElementById("cityErrorMsg").innerText == "" &&
        document.getElementById("emailErrorMsg").innerText == ""
    ) {
        document.getElementById("order").disabled = false;
    } else {
        document.getElementById("order").disabled = true;
    }
}

function checkNoNumbers(event) {
    const regexNoNumbers = /^([^0-9]*)$/;
    if (!regexNoNumbers.test(event.target.value)) {
        document.getElementById(event.target.id+"ErrorMsg").innerText = "/!\\ La saisie n'est pas au bon format";
    } else {
        document.getElementById(event.target.id+"ErrorMsg").innerText = "";
    }
    checkNoError();
}

function checkEmail(event) {
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!regexEmail.test(event.target.value)) {
        document.getElementById("emailErrorMsg").innerText = "/!\\ L'adresse e-mail n'est pas au bon format";
    } else {
        document.getElementById("emailErrorMsg").innerText = "";
    }
    checkNoError();
}

function sendOrder(event) {
    let contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
    }

    let cartJSON = JSON.parse(window.localStorage.getItem("cart"));
    let products = cartJSON.map(p => p.id.toString()); //string array

    let order = {
        contact,
        products
    }

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
            window.location.href = "./confirmation.html?order="+data.orderId;
        });
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

    document.getElementById("firstName").addEventListener("focusout", checkNoNumbers);
    document.getElementById("lastName").addEventListener("focusout", checkNoNumbers);
    document.getElementById("city").addEventListener("focusout", checkNoNumbers);
    document.getElementById("email").addEventListener("focusout", checkEmail);

    checkNoError();

    fetchData(cartJSON);
};