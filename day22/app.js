const API = "https://open.er-api.com/v6/latest/ETB";
const KEY = "birrwatch";

const state = {
    base: "ETB",
    rates: {},
    watchlist: [],
    amount: 100,
    currency: "USD"
};

const status = document.querySelector("#status");
const form = document.querySelector("#convert-form");
const amount = document.querySelector("#amount");
const currency = document.querySelector("#currency");
const result = document.querySelector("#result");
const watchUl = document.querySelector("#watchlist");

function render() {
    const codes = Object.keys(state.rates);

    currency.innerHTML = codes
        .map(code => `<option value="${code}">${code}</option>`)
        .join("");

    if (codes.includes(state.currency)) {
        currency.value = state.currency;
    } else if (codes.length > 0) {
        state.currency = codes[0];
        currency.value = codes[0];
    }

    renderWatchlist();
}

async function loadRates() {
    status.textContent = "Loading rates...";

    try {
        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const data = await response.json();

        if (data.result !== "success") {
            throw new Error("API request failed");
        }

        state.rates = data.rates;

        status.textContent = "";

        render();
    } catch (error) {
        status.textContent = "Could not load rates.";
        console.error(error);
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const amt = Number(amount.value);

    if (!amt || amt <= 0 || Number.isNaN(amt)) {
        result.textContent = "Enter a valid amount.";
        return;
    }

    state.amount = amt;
    state.currency = currency.value;

    const rate = state.rates[state.currency];

    if (!rate) {
        result.textContent = "Currency rate is not available.";
        return;
    }

    const converted = (amt * rate).toFixed(2);

    result.textContent =
        `${amt} ETB = ${converted} ${state.currency}`;

    if (!state.watchlist.includes(state.currency)) {
        state.watchlist.push(state.currency);
    }

    save();
    renderWatchlist();
});

function renderWatchlist() {
    if (state.watchlist.length === 0) {
        watchUl.innerHTML = "<li>No currencies yet</li>";
        return;
    }

    watchUl.innerHTML = state.watchlist
        .map(code => {
            const rate = state.rates[code];

            if (!rate) {
                return "";
            }

            return `
                <li data-c="${code}">
                    <span>1 ETB = ${rate} ${code}</span>
                    <button class="rm" type="button">×</button>
                </li>
            `;
        })
        .join("");
}



watchUl.addEventListener("click", (event) => {
    if (!event.target.matches(".rm")) {
        return;
    }

    const item = event.target.closest("li");
    const code = item.dataset.c;

    state.watchlist = state.watchlist.filter(
        currency => currency !== code
    );

    save();
    renderWatchlist();
});

function save() {
    localStorage.setItem(
        KEY,
        JSON.stringify({
            watchlist: state.watchlist,
            currency: state.currency
        })
    );
}

function load() {
    const saved = localStorage.getItem(KEY);

    if (!saved) {
        return;
    }

    try {
        const data = JSON.parse(saved);

        if (Array.isArray(data.watchlist)) {
            state.watchlist = data.watchlist;
        }

        if (typeof data.currency === "string") {
            state.currency = data.currency;
        }
    } catch (error) {
        localStorage.removeItem(KEY);
        console.error(error);
    }
}

async function init() {
    load();
    await loadRates();

    amount.value = state.amount;
    render();
}

init();