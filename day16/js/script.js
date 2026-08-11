console.log("Yoonas")
console.log("Hello World")


const bill = number (400);
const partySize = 4;

let tipRate 

if (bill > 3000){
    tipRate = 0.10;
} else {
    tipRate = 0.05;
}

const tip = bill * tipRate ;
const total = bill + tip;
const PerPerson = total / partySize ;

let serviceFee

const service = "Telle Birr"
 
switch(service){
    case "Telle birr" : 
    serviceFee = 5;
    break;
    case "CBE Birr" :
        serviceFee = 3;
    default:
        serviceFee = 0;

}

const FinalTotal = total + serviceFee;
const finalperPerson = FinalTotal / partySize;

console.log(`bill: ${bill} ETB`);
console.log(``)
