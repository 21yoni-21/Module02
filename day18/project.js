{
  const cities = ["Addis", "Gondar", "Bahir Dar"];

  console.log(cities[0]);
  console.log(cities.length);
  console.log(cities.includes("Addis"));
  console.log(cities.find(city => city.startsWith("A")));

  for (const city of cities) {
    console.log(city);
  }

  const numbers = [10, 20, 30, 40];

  const doubled = numbers.map(number => number * 2);

  const greaterThan20 = numbers.filter(number => number > 20);

  const total = numbers.reduce((sum, number) => sum + number, 0);

  console.log("Doubled:", doubled);
  console.log("Greater than 20:", greaterThan20);
  console.log("Total:", total);

  const customer = {
    name: "Abebe Kebede",
    city: "Addis Ababa",
    balance: 2000,
    isMember: true
  };

  console.log(customer.name);
  console.log(customer["city"]);

  customer.phone = "0911000000";

  console.log(customer);

  const key = "city";

  console.log(customer[key]);

  console.log(Object.keys(customer));
  console.log(Object.values(customer));
  console.log(Object.entries(customer));

  for (const [key, value] of Object.entries(customer)) {
    console.log(key, value);
  }

  const { name, city } = customer;

  console.log(name);
  console.log(city);

  const [first, second] = cities;

  console.log(first);
  console.log(second);

  const [head, ...tail] = cities;

  console.log(head);
  console.log(tail);

  const updatedCustomer = {
    ...customer,
    city: "Bahir Dar"
  };

  console.log(updatedCustomer);

  const customerWithPhone = {
    ...customer,
    phone: "0911223344"
  };

  console.log(customerWithPhone);

  function sum(...numbers) {
    return numbers.reduce((total, number) => total + number, 0);
  }

  console.log(sum(10, 20, 30));

  console.log(customer?.address?.zone);

  const display = name ?? "Guest";

  console.log(display);

  const x = 10;
  const y = 20;

  const point = { x, y };

  console.log(point);

  const selectedCities = cities.slice(0, 2);

  console.log(selectedCities);
}
