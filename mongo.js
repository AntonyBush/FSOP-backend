const mongoose = require("mongoose");

const cla = process.argv;
if (cla.length < 3) {
  console.log("Enter the password");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://AntiBus:${password}@cluster0.fr4owdr.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (cla.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook: ");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];
  const person = new Person({
    name,
    number,
  });
  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
