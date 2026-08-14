const form = document.querySelector("#signup");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const message = document.querySelector("#message");
const userCount = document.querySelector("#userCount");

const PHONE = /^(?:\+251|0)9\d{8}$/;

function loadUsers() {
    try {
        const raw = localStorage.getItem("users");
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        return [];
    }
}

function validate({ name, phone }) {
    if (!name) {
        return "Please enter your name.";
    }

    if (name.length < 2) {
        return "Name is too short.";
    }

    if (!phone) {
        return "Phone is required.";
    }

    if (!PHONE.test(phone)) {
        return "Please enter a valid Ethiopian phone number.";
    }

    return "";
}

const users = loadUsers();

userCount.textContent = users.length;

form.addEventListener("submit", (e) => {
    e.preventDefault();

    message.textContent = "";

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    const error = validate({ name, phone });

    if (error) {
        message.textContent = error;
        return;
    }

    const newUser = {
        name: name,
        phone: phone
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    userCount.textContent = users.length;

    message.textContent = "Sign-up successful!";

    form.reset();
});