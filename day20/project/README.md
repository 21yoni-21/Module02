# Country Facts Page

## Description

Country Facts is a single-page JavaScript application that fetches live country information from the REST Countries API.

The user can search for a country and view:

- Country name
- Flag
- Capital
- Population
- Region
- Currencies

The page loads Ethiopia automatically when it first opens.

## Technologies

- HTML5
- CSS3
- JavaScript
- Fetch API
- Async/Await
- DOM Manipulation

## API

This project uses the free REST Countries API:

https://restcountries.com/

Country endpoint:

https://restcountries.com/v3.1/name/{country}

## How to Run

1. Open the project folder.
2. Open `index.html` in a web browser.
3. The page automatically loads Ethiopia.
4. Enter another country name in the search field.
5. Click Search.
6. The country facts will be displayed.

## Error Handling

The application:

- Shows Loading while fetching data.
- Checks `res.ok`.
- Handles HTTP errors.
- Handles network errors.
- Displays a friendly error message when a country cannot be found.

## Project Structure

country-facts/
├── index.html
├── styles.css
├── app.js
└── README.md