window.onload = function() {
    // Récupérer le numéro de commande de l'URL
    const orderURL = new URL(window.location.toLocaleString());
    const orderNumber = orderURL.searchParams.get('order');

    // Afficher le numéro de commande
    document.getElementById("orderId").innerText = orderNumber;
};