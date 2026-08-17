# Validated Persistent Signup Form

## Description

This project is a signup form that validates a user's full name and Ethiopian phone number.

Valid signup entries are saved to localStorage as JSON and restored when the page is reloaded.

## Validation

The name must contain at least two characters.

The Ethiopian phone number must match:

/^(?:\+251|0)9\d{8}$/

Valid examples:

0912345678
+251912345678

## Technologies

- HTML
- JavaScript
- DOM
- localStorage
- JSON
- Regular Expressions
- Form Validation

## How to Open

Open `index.html` in a web browser.

## Files

- index.html - signup form
- app.js - validation, storage and form handling
- README.md - project documentation