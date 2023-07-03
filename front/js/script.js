// Tableau des données des produits
let productsData = [];

// Ajouter chaque produit (en paramètre de la fonction) au DOM
function addProductHTML(product) {

	// <a>
	const productLink = document.createElement("a");
	productLink.href = "./product.html?id=" + encodeURIComponent(product._id);

	// <article>
	const productArticle = document.createElement("article");

	// Image
	const productImg = document.createElement("img");
	productImg.src = product.imageUrl;
	productImg.alt = product.altTxt + ', ' + product.name;

	// Nom
	const productName = document.createElement("h3");
	productName.className = "productName";
	productName.textContent = product.name;

	// Description
	const productDescription = document.createElement("p");
	productDescription.className = "productDescription"
	productDescription.textContent = product.description

	// Remplir <article>
	productArticle.appendChild(productImg)
	productArticle.appendChild(productName)
	productArticle.appendChild(productDescription)
	productLink.appendChild(productArticle)

	// Ajouter au DOM
	document.querySelector(".items").appendChild(productLink)
}

// Récupérer les données des produits de l'API
function fetchData() {
	fetch("http://localhost:3000/api/products")
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			productsData = data;

			// Ajouter tous les produits au DOM
			for (product of productsData) {
				addProductHTML(product);
			};
		});
}

window.onload = function() {
	fetchData();
};