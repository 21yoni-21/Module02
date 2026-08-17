const lang = document.querySelector("#lang");
const languageMessage = document.querySelector("#languageMessage");

const form = document.querySelector("#signup");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const errorMessage = document.querySelector("#error");
const successMessage = document.querySelector("#success");
const entriesList = document.querySelector("#entries");

const PHONE = /^(?:\+251|0)9\d{8}$/;


const savedLanguage = localStorage.getItem("lang");

if (savedLanguage) {
    lang.value = savedLanguage;
}

function updateLanguageMessage() {
    if (lang.value === "am") {
        languageMessage.textContent = "ቋንቋ፡ አማርኛ";
    } else {
        languageMessage.textContent = "Language: English";
    }
}

updateLanguageMessage();

lang.addEventListener("change", () => {
    localStorage.setItem("lang", lang.value);
    updateLanguageMessage();
});


function save(entries) {
    localStorage.setItem("entries", JSON.stringify(entries));
}


function load() {
    try {
        const raw = localStorage.getItem("entries");

        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        return [];
    }
}


function validate({ name, phone }) {

    if (!name) {
        return "Please enter your name.";
    }

    if (name.length < 2) {
        return "Name must be at least two characters.";
    }

    if (!phone) {
        return "Phone is required.";
    }

    if (!PHONE.test(phone)) {
        return "Please enter a valid Ethiopian phone number.";
    }

    return "";
}


function renderEntries() {
    const entries = load();

    entriesList.innerHTML = "";

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

    const error = validate({
        name,
        phone
    });

    if (error) {
        errorMessage.textContent = error;
        return;
    }

    const entries = load();

    const entry = {
        name,
        phone
    };

    entries.push(entry);

    save(entries);

    successMessage.textContent = "Signup saved successfully.";

    form.reset();

    renderEntries();
});


renderEntries();