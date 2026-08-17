const title = document.querySelector("#title");

title.textContent = "Selam, Day 19!";
title.classList.toggle("highlight");


const cities = ["Addis Ababa", "Mekelle", "Gondar"];

const cityList = document.querySelector("#cities");

cities.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    cityList.append(li);
});


const button = document.querySelector("#clickBtn");
const box = document.querySelector("#box");

button.addEventListener("click", event => {
    console.log("Button target:", event.target);
});

box.addEventListener("click", event => {
    console.log("Div listener:", event.currentTarget);
});


const items = document.querySelector("#items");

items.addEventListener("click", event => {
    if (event.target.matches(".delete")) {
        event.target.closest("li").remove();
    }
});


const form = document.querySelector("#itemForm");
const input = document.querySelector("#itemInput");
const newItems = document.querySelector("#newItems");

form.addEventListener("submit", event => {
    event.preventDefault();

    const text = input.value.trim();

    if (text) {
        const li = document.createElement("li");
        li.textContent = text;

        newItems.append(li);

        input.value = "";
    }
});