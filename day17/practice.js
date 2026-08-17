

// Regular function
function vat(amount, rate = 0.15) {
  return amount * rate;
}

console.log("===== Exercise 1: VAT =====");

console.log("Regular function:");
console.log(vat(1000));
console.log(vat(1000, 0.20));

// Arrow function
const vatArrow = (amount, rate = 0.15) => amount * rate;

console.log("Arrow function:");
console.log(vatArrow(1000));
console.log(vatArrow(1000, 0.20));



// Exercise 2: Counter Closure


console.log("\n===== Exercise 2: Counter =====");

function makeCounter() {
  let count = 0;

  return () => ++count;
}

const counter = makeCounter();

console.log(counter());
console.log(counter());
console.log(counter());
console.log(counter());
console.log(counter());



// Exercise 3: Discount Function


console.log("\n===== Exercise 3: Discount =====");

function discountBy(rate) {
  return price => price * (1 - rate);
}

const memberPrice = discountBy(0.10);
const salePrice = discountBy(0.30);

const originalPrice = 1000;

console.log("Original price:", originalPrice, "ETB");
console.log("Member price:", memberPrice(originalPrice), "ETB");
console.log("Sale price:", salePrice(originalPrice), "ETB");


// Exercise 4: Higher-Order Function


console.log("\n===== Exercise 4: Apply VAT to All =====");

function applyToAll(list, fn) {
  const results = [];

  for (const item of list) {
    results.push(fn(item));
  }

  return results;
}

const addVat = price => price * 1.15;

// Declare prices ONLY ONCE
const prices = [100, 500, 1000];

const pricesWithVat = applyToAll(prices, addVat);

console.log("Original prices:");
console.log(prices);

console.log("Prices including VAT:");
console.log(pricesWithVat);


// Exercise 5: forEach()


console.log("\n===== Exercise 5: VAT Details =====");

// Use the existing prices variable
prices.forEach(price => {
  const vatAmount = price * 0.15;
  const total = price + vatAmount;

  console.log(`Price: ${price} ETB`);
  console.log(`VAT: ${vatAmount} ETB`);
  console.log(`Total: ${total} ETB`);
  console.log("--------------------");
});