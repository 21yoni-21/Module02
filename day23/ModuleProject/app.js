const state ={
    dishes: [],
    cart: [],
    search: ""
};

const searchinput = document.querySelector("#search");
const menuEl = document.querySelector("#menu"); 
const CartEl = document.querySelector("#cart");

async function loadmenu(){
    const response = await fetch("./Data/menu.json");
    const dishes = await response.json();

    state.dishes = dishes;

    renderMenu();
  };

function rendermenu(){
    menuEl.innerHTML = state.dishes.map(dish => {
        return `
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

                    <div class="dish-footer">
                        <span class="price">
                            ${dish.price} ETB
                        </span>

                        <button 
                            type="button"
                            class="add-button"
                            data-id="${dish.id}"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </article>` ;
    }).join("");
}

searchInput.addEventListener("input",() => {
    state.search = searchinput.value.trim().toLowerCase();

    rendermenu();
});




