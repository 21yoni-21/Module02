const form = document.querySelector("#signup");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const errorMessage = document.querySelector("#error");
const successMessage = document.querySelector("#success");
const entriesList = document.querySelector("#entries");

const PHONE = /^(?:\+251|0)9\d{8}$/;

function validate(name, phone) {
    if (name.trim().length < 2) {
        return "Enter your full name.";
    }

    if (!PHONE.test(phone)) {
        return "Enter a valid Ethiopian phone number.";
    }

    return "";
}

function save(entries) {
    localStorage.setItem("signups", JSON.stringify(entries));
}

function load() {
    try {
        const raw = localStorage.getItem("signups");

        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        return [];
    }
}

function renderEntries() {
    const entries = load();

    entriesList.textContent = "";

    entries.forEach(entry => {
        const li = document.createElement("li");

        li.textContent = `${entry.name} - ${entry.phone}`;

        entriesList.append(li);
    });
}

form.addEventListener("submit", event => {
    event.preventDefault();

    errorMessage.textContent = "";
    successMessage.textContent = "";

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    const error = validate(name, phone);

    if (error) {
        errorMessage.textContent = error;
        return;
    }

    const entries = load();

    const newEntry = {
        name,
        phone
    };

    entries.push(newEntry);

    save(entries);

    successMessage.textContent = "Signup saved successfully.";

    form.reset();

    renderEntries();
});

renderEntries();