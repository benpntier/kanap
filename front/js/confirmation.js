window.onload = function() {
    const orderURL = new URL(window.location.toLocaleString());
    const orderNumber = orderURL.searchParams.get('order');
    document.getElementById("orderId").innerText = orderNumber;
};