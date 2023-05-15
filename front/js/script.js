let productsData = [];

function addProductHTML(product) {

	const productLink = document.createElement("a");
	productLink.href = "./product.html?id=" + product._id;

	const productArticle = document.createElement("article");

	const productImg = document.createElement("img");
	productImg.src = product.imageUrl;
	productImg.alt = product.altTxt + ', ' + product.name;

	const productName = document.createElement("h3");
	productName.className = "productName";
	productName.innerText = product.name;

	const productDescription = document.createElement("p");
	productDescription.className = "productDescription"
	productDescription.innerText = product.description

	productArticle.appendChild(productImg)
	productArticle.appendChild(productName)
	productArticle.appendChild(productDescription)
	productLink.appendChild(productArticle)

	document.querySelector(".items").appendChild(productLink)
}

function fetchData() {
	fetch("http://localhost:3000/api/products")
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			productsData = data;
            //console.log("data:", productsData);

			for (product of productsData) {
				addProductHTML(product);
			};
		});
}

window.onload = function() {
	fetchData();
};