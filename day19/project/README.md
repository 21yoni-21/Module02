# Addis Market Shopping List

## About

Addis Market is an interactive shopping list application built with HTML, CSS, and JavaScript.

The application allows users to:

- Add a shopping item
- Enter an ETB price
- Validate the form
- Mark an item as bought
- Delete an item
- See a live running total

## Technologies

- HTML5
- CSS3
- JavaScript
- DOM
- Events
- Event Delegation

## How to Open

1. Download or clone the repository.
2. Open the project folder.
3. Open `index.html` in a web browser.
4. Enter an item name and price.
5. Click "Add Item".
6. Use "Bought" to mark an item as purchased.
7. Use "Delete" to remove an item.

## Project Features

### Add Items

The form uses `preventDefault()` and validates that the item name and price are provided.

### Create Elements

Each shopping item is created using `createElement()` and added to the list using `append()`.

### Event Delegation

A single click listener on the list handles both the Bought and Delete buttons.

### Running Total

The total price updates whenever an item is added or deleted.

## Project Structure

- `index.html` — page structure
- `styles.css` — application styling
- `app.js` — DOM manipulation and event handling
- `README.md` — project documentation