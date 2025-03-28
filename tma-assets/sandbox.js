const name = "kunal";
const age = 25;
const isStudent = true;
const hobbies = ["reading", "gaming", "coding"];
const address = {
  street: "123 Main St",
  city: "New York",
  state: "NY",
  zip: "10001"
};
const greet = (name) => {
  return `Hello, ${name}!`;
};
const person = {
  name,
  age,
  isStudent,
  hobbies,
  address,
  greet
};
const jsonString = JSON.stringify(person);
const parsedPerson = JSON.parse(jsonString);
console.log(parsedPerson);