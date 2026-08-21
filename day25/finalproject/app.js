const state = {
    dishes: [],
    cart: [],
    search: ""
};

const STORAGE_KEY = "addis-eats-cart";
const PHONE_PATTERN = /^(?:\+251|0)9\d{8}$/;

const searchInput = document.querySelector("#search");
const menuEl = document.querySelector("#menu");
const menuCountEl = document.querySelector("#menu-count");
const menuStatusEl = document.querySelector("#menu-status");
const cartEl = document.querySelector("#cart");
const cartCountEl = document.querySelector("#cart-count");
const totalEl = document.querySelector("#cart-total");

const checkoutForm = document.querySelector("#checkout");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const areaInput = document.querySelector("#area");

const nameError = document.querySelector("#name-error");
const phoneError = document.querySelector("#phone-error");
const areaError = document.querySelector("#area-error");
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
            throw new Error("Menu data is not valid.");
        }

        state.dishes = dishes;

        menuStatusEl.textContent = "";

        render();
    } catch (error) {
        console.error(error);

        menuStatusEl.textContent =
            "Could not load the menu. Please try again.";

        menuCountEl.textContent = "Menu unavailable";

        menuEl.innerHTML = `
            <div class="empty-state">
                <p>We could not load the menu.</p>
                <button id="retry-menu" class="add-button">
                    Try Again
                </button>
            </div>
        `;
    }
}

function getFilteredDishes() {
    const searchText = state.search;

    if (!searchText) {
        return state.dishes;
    }

    return state.dishes.filter(dish => {
        const name = String(dish.name || "").toLowerCase();
        const category = String(dish.category || "").toLowerCase();

        return (
            name.includes(searchText) ||
            category.includes(searchText)
        );
    });
}

function render() {
    renderMenu();
    renderCart();
}

function renderMenu() {
    const filteredDishes = getFilteredDishes();

    if (filteredDishes.length === 0) {
        menuEl.innerHTML = `
            <div class="empty-state">
                <p>No dishes found.</p>
            </div>
        `;

        menuCountEl.textContent = "0 dishes";
        return;
    }

    menuEl.innerHTML = filteredDishes.map(dish => `
        <article class="dish-card">
            <img
                class="dish-image"
                src="${dish.image || ""}"
                alt="${dish.name}"
                loading="lazy"
            >

            <div class="dish-content">
                <span class="dish-category">
                    ${dish.category}
                </span>

                <h3>${dish.name}</h3>

                <p class="dish-price">
                    ${dish.price} ETB
                </p>

                ${
                    dish.spicy
                        ? `<span class="spicy">🌶️ Spicy</span>`
                        : ""
                }

                <button
                    class="add-button"
                    data-id="${dish.id}"
                    type="button"
                >
                    Add to Cart
                </button>
            </div>
        </article>
    `).join("");

    menuCountEl.textContent =
        `${filteredDishes.length} ${filteredDishes.length === 1 ? "dish" : "dishes"}`;
}

function addToCart(id) {
    const dish = state.dishes.find(item => Number(item.id) === Number(id));

    if (!dish) {
        console.error("Dish not found:", id);
        return;
    }

    const existingItem = state.cart.find(
        item => Number(item.id) === Number(id)
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({
            id: Number(dish.id),
            name: dish.name,
            price: Number(dish.price) || 0,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
}

function changeQuantity(id, amount) {
    const item = state.cart.find(
        cartItem => Number(cartItem.id) === Number(id)
    );

    if (!item) {
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {
        state.cart = state.cart.filter(
            cartItem => Number(cartItem.id) !== Number(id)
        );
    }

    saveCart();
    renderCart();
}

function removeFromCart(id) {
    state.cart = state.cart.filter(
        item => Number(item.id) !== Number(id)
    );

    saveCart();
    renderCart();
}

function cartItemCount() {
    return state.cart.reduce((count, item) => {
        return count + Number(item.quantity || 0);
    }, 0);
}

function cartTotal() {
    return state.cart.reduce((total, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;

        return total + price * quantity;
    }, 0);
}

function renderCart() {
    const count = cartItemCount();
    const total = cartTotal();

    if (cartCountEl) {
        cartCountEl.textContent = count;
    }

    if (totalEl) {
        totalEl.textContent = `${total.toFixed(2)} ETB`;
    }

    if (state.cart.length === 0) {
        cartEl.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty.</p>
                <p>Add some delicious Ethiopian food!</p>
            </div>
        `;

        return;
    }

    cartEl.innerHTML = `
        <div class="cart-items">
            ${state.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price} ETB each</p>
                    </div>

                    <div class="cart-item-controls">
                        <button
                            type="button"
                            class="quantity-button"
                            data-action="decrease"
                            data-id="${item.id}"
                            aria-label="Decrease ${item.name} quantity"
                        >
                            −
                        </button>

                        <span class="quantity">
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            class="quantity-button"
                            data-action="increase"
                            data-id="${item.id}"
                            aria-label="Increase ${item.name} quantity"
                        >
                            +
                        </button>

                        <button
                            type="button"
                            class="remove-button"
                            data-action="remove"
                            data-id="${item.id}"
                        >
                            Remove
                        </button>
                    </div>

                    <strong class="item-total">
                        ${(item.price * item.quantity).toFixed(2)} ETB
                    </strong>
                </div>
            `).join("")}
        </div>

        <div class="cart-summary">
            <strong>Total: ${total.toFixed(2)} ETB</strong>
        </div>
    `;
}

function clearErrors() {
    if (nameError) {
        nameError.textContent = "";
    }

    if (phoneError) {
        phoneError.textContent = "";
    }

    if (areaError) {
        areaError.textContent = "";
    }

    if (formError) {
        formError.textContent = "";
    }

    nameInput?.classList.remove("input-error");
    phoneInput?.classList.remove("input-error");
    areaInput?.classList.remove("input-error");
}

function validateCheckout() {
    clearErrors();

    let valid = true;

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const area = areaInput.value.trim();

    if (name.length < 2) {
        nameError.textContent =
            "Please enter your name.";

        nameInput.classList.add("input-error");

        valid = false;
    }

    if (!PHONE_PATTERN.test(phone)) {
        phoneError.textContent =
            "Enter a valid Ethiopian phone number.";

        phoneInput.classList.add("input-error");

        valid = false;
    }

    if (!area) {
        areaError.textContent =
            "Please select your delivery area.";

        areaInput.classList.add("input-error");

        valid = false;
    }

    if (state.cart.length === 0) {
        formError.textContent =
            "Your cart is empty. Please add an item first.";

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

    console.log("Order:", order);

    state.cart = [];

    saveCart();
    renderCart();

    checkoutForm.reset();

    if (orderSuccess) {
        orderSuccess.hidden = false;
        orderSuccess.textContent =
            `Order placed successfully! Total: ${order.total.toFixed(2)} ETB`;
    }

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
}

searchInput?.addEventListener("input", () => {
    state.search = searchInput.value
        .trim()
        .toLowerCase();

    renderMenu();
});

menuEl?.addEventListener("click", event => {
    const button = event.target.closest(".add-button");

    if (!button) {
        return;
    }

    const id = Number(button.dataset.id);

    addToCart(id);
});

menuEl?.addEventListener("click", event => {
    if (event.target.id !== "retry-menu") {
        return;
    }

    loadMenu();
});

cartEl?.addEventListener("click", event => {
    const button = event.target.closest("button");

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

checkoutForm?.addEventListener("submit", event => {
    event.preventDefault();

    if (orderSuccess) {
        orderSuccess.hidden = true;
    }

    if (!validateCheckout()) {
        return;
    }

    placeOrder();
});

[nameInput, phoneInput, areaInput].forEach(input => {
    input?.addEventListener("input", () => {
        if (orderSuccess) {
            orderSuccess.hidden = true;
        }
    });
});

loadCart();
loadMenu();