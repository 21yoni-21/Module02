const STORAGE_KEY = "addis-eats-cart";
const PHONE_PATTERN = /^(?:\+251|0)9\d{8}$/;

const state = {
    dishes: [],
    cart: [],
    search: ""
};

const searchInput = document.querySelector("#search");
const menuEl = document.querySelector("#menu");
const menuCountEl = document.querySelector("#menu-count");
const menuStatusEl = document.querySelector("#menu-status");
const cartEl = document.querySelector("#cart");
const checkoutForm = document.querySelector("#checkout");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const areaInput = document.querySelector("#area");
const formError = document.querySelector("#form-error");
const orderSuccess = document.querySelector("#order-success");

function loadCart() {
    try {
        const savedCart = localStorage.getItem(STORAGE_KEY);

        if (!savedCart) {
            return;
        }

        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
            state.cart = parsedCart;
        }
    } catch (error) {
        console.error("Could not load cart:", error);
        state.cart = [];
    }
}

function saveCart() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state.cart)
        );
    } catch (error) {
        console.error("Could not save cart:", error);
    }
}

async function loadMenu() {
    menuStatusEl.textContent = "Loading menu...";

    try {
        const response = await fetch("./data/menu.json");

        if (!response.ok) {
            throw new Error("Could not load menu.");
        }

        const dishes = await response.json();

        if (!Array.isArray(dishes)) {
            throw new Error("Menu data is invalid.");
        }

        state.dishes = dishes;

        render();

    } catch (error) {
        console.error(error);

        menuStatusEl.textContent =
            "Could not load the menu. Please try again.";

        menuCountEl.textContent = "Menu unavailable";
    }
}

function getFilteredDishes() {
    return state.dishes.filter(dish => {
        const searchText = state.search;

        return (
            dish.name.toLowerCase().includes(searchText) ||
            dish.category.toLowerCase().includes(searchText)
        );
    });
}

function render() {
    renderMenu();
    renderCart();
}

function renderMenu() {
    const filteredDishes = getFilteredDishes();

    if (state.dishes.length === 0) {
        menuEl.innerHTML = "";
        menuStatusEl.textContent = "No dishes available.";
        menuCountEl.textContent = "0 dishes";
        return;
    }

    if (filteredDishes.length === 0) {
        menuEl.innerHTML = `
            <div class="no-results">
                <h2>No dishes found</h2>
                <p>Try another search term.</p>
            </div>
        `;

        menuStatusEl.textContent = "";
        menuCountEl.textContent = "0 results";
        return;
    }

    menuStatusEl.textContent = "";

    menuCountEl.textContent =
        `${filteredDishes.length} dish${filteredDishes.length === 1 ? "" : "es"}`;

    menuEl.innerHTML = filteredDishes.map(dish => `
        <article class="dish-card">

            <div class="dish-image">
                <span class="dish-placeholder">
                    ${dish.name}
                </span>
            </div>

            <div class="dish-content">

                <span class="category">
                    ${dish.category}
                </span>

                <h2>${dish.name}</h2>

                <p class="description">
                    ${getDishDescription(dish)}
                </p>

                <div class="dish-footer">

                    <div class="price-area">
                        <span class="price">
                            ${dish.price} ETB
                        </span>

                        ${
                            dish.spicy
                                ? '<span class="spicy">🌶 Spicy</span>'
                                : ""
                        }
                    </div>

                    <button
                        type="button"
                        class="add-button"
                        data-action="add"
                        data-id="${dish.id}"
                    >
                        Add
                    </button>

                </div>

            </div>

        </article>
    `).join("");
}

function getDishDescription(dish) {
    const descriptions = {
        "Doro Wat":
            "Traditional Ethiopian chicken stew with berbere and spices.",
        "Shiro":
            "Smooth chickpea stew served with fresh Ethiopian injera.",
        "Kitfo":
            "Seasoned Ethiopian minced beef prepared with traditional spices.",
        "Tibs":
            "Tender sautéed meat prepared with onions, peppers and spices.",
        "Injera Firfir":
            "Pieces of injera mixed with flavorful berbere sauce.",
        "Beyaynetu":
            "A colorful combination of Ethiopian vegetarian dishes.",
        "Misir Wat":
            "Spicy Ethiopian red lentil stew cooked with berbere."
    };

    return descriptions[dish.name] ||
        "A delicious Ethiopian dish prepared with traditional flavors.";
}

function addToCart(id) {
    const dish = state.dishes.find(item => item.id === id);

    if (!dish) {
        return;
    }

    const existingItem = state.cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({
            id: dish.id,
            name: dish.name,
            price: dish.price,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
}

function changeQuantity(id, amount) {
    const item = state.cart.find(cartItem => cartItem.id === id);

    if (!item) {
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {
        state.cart = state.cart.filter(
            cartItem => cartItem.id !== id
        );
    }

    saveCart();
    renderCart();
}

function removeFromCart(id) {
    state.cart = state.cart.filter(
        item => item.id !== id
    );

    saveCart();
    renderCart();
}

function cartTotal() {
    return state.cart.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
}

function cartItemCount() {
    return state.cart.reduce((count, item) => {
        return count + item.quantity;
    }, 0);
}

function renderCart() {
    if (state.cart.length === 0) {
        cartEl.innerHTML = `
            <div class="cart-header">

                <div>
                    <p class="section-label">Your order</p>
                    <h2 id="cart-title">Cart</h2>
                </div>

                <span class="cart-badge">0</span>

            </div>

            <div class="cart-empty">

                <div class="cart-icon">🛒</div>

                <h3>Your cart is empty</h3>

                <p>
                    Add dishes from the menu to start your order.
                </p>

            </div>

            <div class="cart-summary">

                <div class="summary-row">
                    <span>Total</span>
                    <strong>0 ETB</strong>
                </div>

                <button
                    type="button"
                    class="checkout-button"
                    disabled
                >
                    Checkout
                </button>

            </div>
        `;

        return;
    }

    cartEl.innerHTML = `
        <div class="cart-header">

            <div>
                <p class="section-label">Your order</p>
                <h2 id="cart-title">Cart</h2>
            </div>

            <span class="cart-badge">
                ${cartItemCount()}
            </span>

        </div>

        <div class="cart-items">

            ${state.cart.map(item => `
                <div class="cart-item">

                    <div class="cart-item-info">
                        <h3>${item.name}</h3>

                        <p>
                            ${item.price} ETB each
                        </p>
                    </div>

                    <div class="cart-item-actions">

                        <div class="quantity-controls">

                            <button
                                type="button"
                                class="quantity-button"
                                data-action="decrease"
                                data-id="${item.id}"
                                aria-label="Decrease ${item.name} quantity"
                            >
                                −
                            </button>

                            <span>${item.quantity}</span>

                            <button
                                type="button"
                                class="quantity-button"
                                data-action="increase"
                                data-id="${item.id}"
                                aria-label="Increase ${item.name} quantity"
                            >
                                +
                            </button>

                        </div>

                        <strong>
                            ${item.price * item.quantity} ETB
                        </strong>

                        <button
                            type="button"
                            class="remove-button"
                            data-action="remove"
                            data-id="${item.id}"
                        >
                            Remove
                        </button>

                    </div>

                </div>
            `).join("")}

        </div>

        <div class="cart-summary">

            <div class="summary-row">
                <span>Total</span>
                <strong>${cartTotal()} ETB</strong>
            </div>

            <button
                type="button"
                class="checkout-button"
                onclick="document.querySelector('#checkout').scrollIntoView({ behavior: 'smooth' })"
            >
                Checkout
            </button>

        </div>
    `;
}

function clearErrors() {
    document.querySelector("#name-error").textContent = "";
    document.querySelector("#phone-error").textContent = "";
    document.querySelector("#area-error").textContent = "";
    formError.textContent = "";

    nameInput.classList.remove("input-error");
    phoneInput.classList.remove("input-error");
    areaInput.classList.remove("input-error");
}

function validateCheckout() {
    clearErrors();

    let valid = true;

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const area = areaInput.value;

    if (name.length < 2) {
        document.querySelector("#name-error").textContent =
            "Please enter your name.";

        nameInput.classList.add("input-error");

        valid = false;
    }

    if (!PHONE_PATTERN.test(phone)) {
        document.querySelector("#phone-error").textContent =
            "Enter a valid Ethiopian phone number.";

        phoneInput.classList.add("input-error");

        valid = false;
    }

    if (!area) {
        document.querySelector("#area-error").textContent =
            "Please select your delivery area.";

        areaInput.classList.add("input-error");

        valid = false;
    }

    if (state.cart.length === 0) {
        formError.textContent =
            "Your cart is empty. Add an item before placing your order.";

        valid = false;
    }

    return valid;
}

function placeOrder() {
    const order = {
        customer: {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            area: areaInput.value
        },
        items: state.cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total: cartTotal(),
        createdAt: new Date().toISOString()
    };

    state.cart = [];

    saveCart();
    renderCart();

    checkoutForm.reset();

    orderSuccess.hidden = false;

    orderSuccess.innerHTML = `
        <div class="success-icon">✓</div>

        <h3>Order placed successfully!</h3>

        <p>
            Thank you, ${escapeHtml(order.customer.name)}.
        </p>

        <p>
            Your order will be delivered to
            <strong>${escapeHtml(order.customer.area)}</strong>.
        </p>

        <p>
            Total:
            <strong>${order.total} ETB</strong>
        </p>

        <button
            type="button"
            class="new-order-button"
            id="new-order"
        >
            Start New Order
        </button>
    `;

    orderSuccess.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

searchInput.addEventListener("input", () => {
    state.search = searchInput.value
        .trim()
        .toLowerCase();

    renderMenu();
});

menuEl.addEventListener("click", event => {
    const button = event.target.closest("[data-action='add']");

    if (!button) {
        return;
    }

    const id = Number(button.dataset.id);

    addToCart(id);
});

cartEl.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");

    if (!button) {
        return;
    }

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "increase") {
        changeQuantity(id, 1);
    }

    if (action === "decrease") {
        changeQuantity(id, -1);
    }

    if (action === "remove") {
        removeFromCart(id);
    }
});

checkoutForm.addEventListener("submit", event => {
    event.preventDefault();

    orderSuccess.hidden = true;

    if (!validateCheckout()) {
        return;
    }

    placeOrder();
});

orderSuccess.addEventListener("click", event => {
    if (event.target.id === "new-order") {
        orderSuccess.hidden = true;
        nameInput.focus();
    }
});

loadCart();
loadMenu();