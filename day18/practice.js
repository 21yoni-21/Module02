const prices = [250, 600, 180, 900, 1200, 750];

const pricesWithVat = prices.map(price => price * 1.15);

const under1000 = pricesWithVat.filter(price => price < 1000);

const grandTotal = under1000.reduce((sum, price) => sum + price, 0);

console.log("Prices with VAT:", pricesWithVat);
console.log("Under 1000 ETB:", under1000);
console.log("Grand Total:", grandTotal, "ETB");

const customer = {
  name: "Almaz Bekele",
  city: "Addis Ababa",
  balance: 1500
};

for (const [key, value] of Object.entries(customer)) {
  console.log(key, value);
}

const { name, city } = customer;

function greet({ name }) {
  return `Selam ${name}`;
}

console.log(name);
console.log(city);
console.log(greet(customer));

console.log("hello world");
