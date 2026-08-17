const rateBtn = document.querySelector("#rateBtn");
const rateResult = document.querySelector("#rateResult");

const countryBtn = document.querySelector("#countryBtn");
const countryResult = document.querySelector("#countryResult");

const wrongBtn = document.querySelector("#wrongBtn");
const errorBtn = document.querySelector("#errorBtn");
const errorResult = document.querySelector("#errorResult");

const postsBtn = document.querySelector("#postsBtn");
const postsResult = document.querySelector("#postsResult");

const loadBtn = document.querySelector("#loadBtn");
const status = document.querySelector("#status");
const result = document.querySelector("#result");


async function getEtbRate() {
    const url = "https://open.er-api.com/v6/latest/USD";

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    return data.rates.ETB;
}


rateBtn.addEventListener("click", async () => {
    rateResult.textContent = "Loading...";

    try {
        const rate = await getEtbRate();

        rateResult.textContent =
            `1 USD = ${rate.toFixed(2)} ETB`;
    } catch (error) {
        rateResult.textContent =
            `Error: ${error.message}`;
    }
});


async function getEthiopia() {
    try {
        const res = await fetch(
            "https://restcountries.com/v3.1/name/ethiopia"
        );

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        return data[0];
    } catch (error) {
        throw error;
    }
}


countryBtn.addEventListener("click", async () => {
    countryResult.textContent = "Loading...";

    try {
        const country = await getEthiopia();

        countryResult.textContent =
            `Country: ${country.name.common}, Capital: ${country.capital[0]}`;
    } catch (error) {
        countryResult.textContent =
            `Error: ${error.message}`;
    }
});


wrongBtn.addEventListener("click", async () => {
    errorResult.textContent = "Testing wrong URL...";

    try {
        const res = await fetch(
            "https://this-domain-does-not-exist-example-12345.com/data"
        );

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        errorResult.textContent = JSON.stringify(data);
    } catch (error) {
        errorResult.textContent =
            `Network error caught: ${error.message}`;
    }
});


errorBtn.addEventListener("click", async () => {
    errorResult.textContent = "Testing HTTP 404...";

    try {
        const res = await fetch(
            "https://jsonplaceholder.typicode.com/posts/999999999"
        );

        console.log("Response status:", res.status);
        console.log("Response ok:", res.ok);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        errorResult.textContent = JSON.stringify(data);
    } catch (error) {
        errorResult.textContent =
            `404 caught because res.ok was false: ${error.message}`;
    }
});


async function getFirstTwoPosts() {
    const listResponse = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
    );

    if (!listResponse.ok) {
        throw new Error(`HTTP ${listResponse.status}`);
    }

    const posts = await listResponse.json();

    const firstTwo = posts.slice(0, 2);

    const details = await Promise.all(
        firstTwo.map(async post => {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts/${post.id}`
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        })
    );

    return details;
}


postsBtn.addEventListener("click", async () => {
    postsResult.innerHTML = "<li>Loading...</li>";

    try {
        const posts = await getFirstTwoPosts();

        postsResult.innerHTML = "";

        posts.forEach(post => {
            const li = document.createElement("li");

            li.textContent =
                `Post ${post.id}: ${post.title}`;

            postsResult.append(li);
        });
    } catch (error) {
        postsResult.innerHTML =
            `<li>Error: ${error.message}</li>`;
    }
});


async function loadApiData() {
    status.textContent = "Loading...";
    status.className = "status loading";
    result.innerHTML = "";

    try {
        const res = await fetch(
            "https://restcountries.com/v3.1/name/ethiopia"
        );

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        const country = data[0];

        status.textContent = "Data loaded successfully.";
        status.className = "status success";

        const article = document.createElement("article");
        article.classList.add("country");

        const title = document.createElement("h3");
        title.textContent = country.name.common;

        const capital = document.createElement("p");
        capital.textContent =
            `Capital: ${country.capital[0]}`;

        const population = document.createElement("p");
        population.textContent =
            `Population: ${country.population.toLocaleString()}`;

        article.append(title, capital, population);

        result.append(article);

    } catch (error) {
        status.textContent = "Could not load data.";
        status.className = "status error";

        const message = document.createElement("p");

        message.textContent =
            `Error: ${error.message}`;

        result.append(message);
    }
}


loadBtn.addEventListener("click", loadApiData);