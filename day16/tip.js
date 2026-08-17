const bill = Number(prompt("Enter the bill amount in ETB:"));
const partySize = Number(prompt("Enter the number of people:"));
const paymentMethod = prompt("Enter payment method: TeleBirr or CBE Birr");

// Calculate tip
let tipRate;

if (bill > 300) {
  tipRate = 0.10;
} else {
  tipRate = 0.05;
}

const tip = bill * tipRate;

// Service fee
let serviceFee;

switch (paymentMethod.toLowerCase()) {
  case "telebirr":
    serviceFee = 5;
    break;

  case "cbe birr":
    serviceFee = 3;
    break;

  default:
    serviceFee = 0;
}

// Calculate total
const total = bill + tip + serviceFee;
const perPerson = total / partySize;

// Print result
console.log(`Bill: ${bill.toFixed(2)} ETB`);
console.log(`Tip: ${tip.toFixed(2)} ETB`);
console.log(`Service fee: ${serviceFee.toFixed(2)} ETB`);
console.log(`Total: ${total.toFixed(2)} ETB`);
console.log(`Each person pays: ${perPerson.toFixed(2)} ETB`);


console.log("Hello World")