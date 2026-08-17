


function createLoyalty(earnRule = etb => Math.floor(etb / 10)) {
  let points = 0; 

  return {
 
    earn(etb) {
      points += earnRule(etb);
    },

   
    redeem(amount) {
      points = Math.max(0, points - amount);
    },

  
    balance() {
      return points;
    }
  };
}



const card = createLoyalty();

card.earn(250); 
console.log(`Points after spending 250 ETB: ${card.balance()}`);

card.redeem(10);
console.log(`Points after redeeming 10: ${card.balance()}`);



card.redeem(100);
console.log(`Points after trying to redeem 100: ${card.balance()}`);



const holiday = createLoyalty(
  etb => Math.floor(etb / 10) * 2
);

holiday.earn(250);
console.log(`Holiday points after spending 250 ETB: ${holiday.balance()}`);

holiday.redeem(20);
console.log(`Holiday points after redeeming 20: ${holiday.balance()}`);