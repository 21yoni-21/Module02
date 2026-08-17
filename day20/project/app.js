const form = document.querySelector("#search-form");
const countryInput = document.querySelector("#country");
const facts = document.querySelector("#facts");

function renderFact(container, label, value) {
    const fact = document.createElement("div");
    fact.classList.add("fact");

    const factLabel = document.createElement("span");
    factLabel.classList.add("fact-label");
    factLabel.textContent = label;

    const factValue = document.createElement("span");
    factValue.classList.add("fact-value");
    factValue.textContent = value;

    fact.append(factLabel, factValue);
    container.append(fact);
}

async function showCountry(name) {
    facts.textContent = "Loading...";

    try {
        const countryName = name.trim();

        if (!countryName) {
            throw new Error("Please enter a country name.");
        }

        const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`;

        const response = await fetch(url);

        console.log("Response:", response);
        console.log("Status:", response.status);
        console.log("OK:", response.ok);

        if (!response.ok) {
            throw new Error("Country not found");
        }

        const countries = await response.json();
        const country = countries[0];

        facts.innerHTML = "";

        const card = document.createElement("article");
        card.classList.add("country-card");

        const title = document.createElement("h2");
        title.textContent = country.name.common;

        const flag = document.createElement("img");
        flag.src = country.flags.svg;
        flag.alt = `${country.name.common} flag`;

        const capital = country.capital
            ? country.capital[0]
            : "N/A";

        const population = country.population.toLocaleString();

        const region = country.region || "N/A";

        let currencies = "N/A";

        if (country.currencies) {
            currencies = Object.values(country.currencies)
                .map(currency => {
                    if (currency.symbol) {
                        return `${currency.name} (${currency.symbol})`;
                    }

                    return currency.name;
                })
                .join(", ");
        }

        card.append(title, flag);

        renderFact(card, "Capital", capital);
        renderFact(card, "Population", population);
        renderFact(card, "Region", region);
        renderFact(card, "Currencies", currencies);

        facts.append(card);

    } catch (error) {
        console.error("Error:", error);

        facts.textContent = `Error: ${error.message}`;
    }
}

form.addEventListener("submit", event => {
    event.preventDefault();

    showCountry(countryInput.value);
});

showCountry("Ethiopia");