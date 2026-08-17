const form = document.querySelector("#add-form");
const nameInput = document.querySelector("#name");
const priceInput = document.querySelector("#price");
const list = document.querySelector("#list");
const totalEl = document.querySelector("#total");
const message = document.querySelector("#message");

function addRow(name, price) {
    const li = document.createElement("li");

    const itemInfo = document.createElement("div");
    itemInfo.classList.add("item-info");

    const itemName = document.createElement("span");
    itemName.classList.add("item-name");
    itemName.textContent = name;

    const itemPrice = document.createElement("span");
    itemPrice.classList.add("item-price");
    itemPrice.textContent = `${price.toFixed(2)} ETB`;

    const actions = document.createElement("div");
    actions.classList.add("item-actions");

    const buyButton = document.createElement("button");
    buyButton.classList.add("buy");
    buyButton.textContent = "Bought";

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("del");
    deleteButton.textContent = "Delete";

    itemInfo.append(itemName, itemPrice);
    actions.append(buyButton, deleteButton);
    li.append(itemInfo, actions);

    list.append(li);
}

function updateTotal() {
    const prices = [...list.querySelectorAll(".item-price")].map(item => {
        return Number.parseFloat(item.textContent);
    });

    const total = prices.reduce((sum, price) => sum + price, 0);

    totalEl.textContent = `${total.toFixed(2)} ETB`;
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const price = Number(priceInput.value);

    if (!name || !price || price <= 0) {
        message.textContent = "Please enter an item name and a valid price.";
        return;
    }

    message.textContent = "";

    addRow(name, price);

    form.reset();

    updateTotal();
});

list.addEventListener("click", event => {
    if (event.target.matches(".del")) {
        event.target.closest("li").remove();
        updateTotal();
    } else if (event.target.matches(".buy")) {
        event.target.closest("li").classList.toggle("bought");
    }
});