
const products = [
    { id: 1, name: "Satin Scrunchie Set", category: "Accessories", price: 249, icon: "🎀" },
    { id: 2, name: "Vanilla Scented Candle", category: "Decor", price: 599, icon: "🕯️" },
    { id: 3, name: "Floral Journal", category: "Stationery", price: 349, icon: "📔" },
    { id: 4, name: "Strawberry Lip Balm", category: "Self Care", price: 199, icon: "🍓" },
    { id: 5, name: "Pastel Tote Bag", category: "Accessories", price: 699, icon: "👜" },
    { id: 6, name: "Ceramic Flower Vase", category: "Decor", price: 899, icon: "🏺" },
    { id: 7, name: "Cute Pen Set", category: "Stationery", price: 179, icon: "🖊️" },
    { id: 8, name: "Rose Face Mask", category: "Self Care", price: 299, icon: "🌸" },
    { id: 9, name: "Pearl Hair Clips", category: "Accessories", price: 329, icon: "🦋" },
    { id: 10, name: "Mini Desk Plant", category: "Decor", price: 449, icon: "🪴" },
    { id: 11, name: "Pastel Sticky Notes", category: "Stationery", price: 149, icon: "📝" },
    { id: 12, name: "Lavender Bath Bomb", category: "Self Care", price: 259, icon: "🛁" }
];

let cart = [];
let couponApplied = false;
let total = 0;

function showProducts() {
    let category = document.getElementById("category").value;
    let sort = document.getElementById("sort").value;
    let search = document.getElementById("search").value.toLowerCase();

    let list = products.filter(function(p) {
        return (category === "All" || p.category === category)
            && p.name.toLowerCase().includes(search);
    });

    if (sort === "low") {
        list.sort(function(a, b) { return a.price - b.price; });
    }
    if (sort === "high") {
        list.sort(function(a, b) { return b.price - a.price; });
    }

    let html = "";

    list.forEach(function(p) {
        html += `
            <div class="product-card">
                <div class="product-image">${p.icon}</div>
                <h3>${p.name}</h3>
                <small>${p.category}</small>
                <p>₹${p.price}</p>
                <button onclick="addToCart(${p.id})">Add to Bag ♡</button>
            </div>
        `;
    });

    document.getElementById("products").innerHTML =
        html || "<p>No products found!</p>";
}

function addToCart(id) {
    let item = cart.find(function(p) { return p.id === id; });

    if (item) {
        item.quantity++;
    } else {
        let product = products.find(function(p) { return p.id === id; });
        cart.push({ ...product, quantity: 1 });
    }

    showCart();
}

function changeQty(id, amount) {
    let item = cart.find(function(p) { return p.id === id; });
    item.quantity += amount;

    if (item.quantity <= 0) {
        removeItem(id);
    } else {
        showCart();
    }
}

function removeItem(id) {
    cart = cart.filter(function(p) { return p.id !== id; });
    showCart();
}

function showCart() {
    let html = "";
    let subtotal = 0;
    let count = 0;

    cart.forEach(function(p) {
        subtotal += p.price * p.quantity;
        count += p.quantity;

        html += `
            <div class="cart-item">
                <div>
                    <strong>${p.icon} ${p.name}</strong>
                    <p>₹${p.price} × ${p.quantity} = ₹${p.price * p.quantity}</p>
                </div>
                <div>
                    <button onclick="changeQty(${p.id}, -1)">−</button>
                    ${p.quantity}
                    <button onclick="changeQty(${p.id}, 1)">+</button>
                    <button class="remove" onclick="removeItem(${p.id})">Remove</button>
                </div>
            </div>
        `;
    });

    if (cart.length === 0) {
        html = "<p>Your shopping bag is empty ♡</p>";
        couponApplied = false;
    }

    let discount = couponApplied ? subtotal * 0.10 : 0;
    total = subtotal - discount;

    document.getElementById("cartItems").innerHTML = html;
    document.getElementById("count").textContent = count;
    document.getElementById("subtotal").textContent = "₹" + subtotal;
    document.getElementById("discount").textContent = "₹" + discount.toFixed(2);
    document.getElementById("total").textContent = "₹" + total.toFixed(2);
}

function applyCoupon() {
    let code = document.getElementById("coupon").value.trim().toUpperCase();
    let msg = document.getElementById("couponMsg");

    if (cart.length === 0) {
        msg.textContent = "Add something to your bag first!";
        return;
    }

    if (code === "PETAL10") {
        couponApplied = true;
        msg.textContent = "Yay! 10% discount applied ♡";
    } else {
        couponApplied = false;
        msg.textContent = "Invalid coupon code!";
    }

    showCart();
}

function openCheckout() {
    if (cart.length === 0) {
        alert("Your shopping bag is empty!");
        return;
    }

    document.getElementById("checkoutTotal").textContent =
        "₹" + total.toFixed(2);

    document.getElementById("checkoutModal").style.display = "flex";
}

function closeCheckout() {
    document.getElementById("checkoutModal").style.display = "none";
}

document.getElementById("checkoutForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let payment = document.getElementById("payment").value;
    let orderId = "PS" + Date.now().toString().slice(-6);

    alert(
        "Order Placed Successfully! ♡\n\n" +
        "Thank you, " + name + "!\n" +
        "Order ID: " + orderId + "\n" +
        "Total: ₹" + total.toFixed(2) + "\n" +
        "Payment: " + payment + "\n\n" +
        "Your order has been confirmed (Demo)."
    );

    cart = [];
    couponApplied = false;
    document.getElementById("coupon").value = "";
    document.getElementById("couponMsg").textContent =
        "Try PETAL10 for 10% off ♡";
    document.getElementById("checkoutForm").reset();

    closeCheckout();
    showCart();
});

document.getElementById("category").addEventListener("change", showProducts);
document.getElementById("sort").addEventListener("change", showProducts);
document.getElementById("search").addEventListener("input", showProducts);

showProducts();
showCart();
