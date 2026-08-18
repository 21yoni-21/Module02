const itemForm = document.getElementById("itemForm");
const itemInput = document.getElementById("itemInput");
const shoppingList = document.getElementById("shoppingList");
const itemCount = document.getElementById("itemCount");
const emptyMessage = document.getElementById("emptyMessage");

let items = [];

function render() {
    shoppingList.innerHTML = "";

    itemCount.textContent =
        `${items.length} ${items.length === 1 ? "item" : "items"}`;

    if (items.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    items.forEach(function(item) {
        const listItem = document.createElement("li");

        listItem.classList.add("shopping-item");

        if (item.bought) {
            listItem.classList.add("bought");
        }

        const itemName = document.createElement("span");

        itemName.classList.add("item-name");
        itemName.textContent = item.name;

        const actions = document.createElement("div");

        actions.classList.add("item-actions");

        const boughtButton = document.createElement("button");

        boughtButton.classList.add("buy-button");

        boughtButton.textContent = item.bought
            ? "Undo"
            : "Bought";

        const removeButton = document.createElement("button");

        removeButton.classList.add("remove-button");
        removeButton.textContent = "Remove";

        boughtButton.addEventListener("click", function() {
            toggleBought(item.id);
        });

        removeButton.addEventListener("click", function() {
            removeItem(item.id);
        });

        itemName.addEventListener("click", function() {
            toggleBought(item.id);
        });

        actions.appendChild(boughtButton);
        actions.appendChild(removeButton);

        listItem.appendChild(itemName);
        listItem.appendChild(actions);

        shoppingList.appendChild(listItem);
    });
}

function addItem(name) {
    const newItem = {
        id: Date.now(),
        name: name,
        bought: false
    };

    items.push(newItem);

    render();
}

function toggleBought(id) {
    items = items.map(function(item) {
        if (item.id === id) {
            return {
                ...item,
                bought: !item.bought
            };
        }

        return item;
    });

    render();
}

function removeItem(id) {
    items = items.filter(function(item) {
        return item.id !== id;
    });

    render();
}

itemForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = itemInput.value.trim();

    if (name === "") {
        return;
    }

    addItem(name);

    itemInput.value = "";

    itemInput.focus();
});

render();