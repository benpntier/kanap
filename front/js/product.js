function addProductInfo(product) {
    const productImg = document.createElement("img");
    productImg.src = product.imageUrl
    productImg.alt = product.altTxt;

    document.querySelector(".item__img").appendChild(productImg);
    document.querySelector("#title").innerText = product.name;
    document.querySelector("#price").innerText = product.price;
    document.querySelector("#description").innerText = product.description;

    for (color of product.colors) {
        const productColor = document.createElement("option");
        productColor.value = color;
        productColor.innerHTML = color;
        document.querySelector("#colors").appendChild(productColor);
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

window.onload = function() {
    const productURL = new URL(window.location.toLocaleString());
    const productID = productURL.searchParams.get('id');

    fetchData(productID);
};