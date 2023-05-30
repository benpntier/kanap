let productData = [];

function addProductInfo(product) {
    const productImg = document.createElement("img");
    productImg.src = product.imageUrl;
    productImg.alt = product.altTxt;

    document.querySelector(".item__img").appendChild(productImg);
    document.querySelector("#title").innerText = product.name;
    document.querySelector("#price").innerText = product.price;
    document.querySelector("#description").innerText = product.description;

    const colorsList = document.getElementById("colors");
    for (color of product.colors) {
        const option = new Option(color, color);
        colorsList.options.add(option);
    }
}

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

function saveToLocalStorage(event) {

    const quantitySelector = document.getElementById("quantity");
    const colorsList = document.getElementById("colors");

    if (quantitySelector.value > 0) {
        let cartJSON = JSON.parse(window.localStorage.getItem("cart"));
        if (cartJSON === null) {
            cartJSON = [];
        }
    
        let alreadyInCart = false;
        for (productJSON of cartJSON) {
            if (productJSON.id == event.currentTarget.productID && productJSON.color == colorsList.value) {
                alreadyInCart = true;
                productJSON.quantity = productJSON.quantity + parseInt(quantitySelector.value);
            }
        }

        if (!alreadyInCart) {
            let productObject = {
                id:event.currentTarget.productID,
                color:colorsList.value,
                quantity:parseInt(quantitySelector.value)
            }
            cartJSON.push(productObject)
        }

        window.localStorage.setItem("cart", JSON.stringify(cartJSON));
    }
}

window.onload = function() {
    const productURL = new URL(window.location.toLocaleString());
    const productID = productURL.searchParams.get('id');

    fetchData(productID);

    cartButton = document.getElementById("addToCart");
    cartButton.addEventListener("click", saveToLocalStorage);
    cartButton.productID = productID;
};