const mongoose = require('mongoose')

// read args from command line
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

// replace <password> in your Atlas connection string
const url =
  `mongodb+srv://shrinidhimoorthi_db_user:z2riqk99F2F1uKfj@cluster0.aiutseu.mongodb.net/`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // Only password given → list all entries
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(p => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  // Password + name + number → add new entry
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Usage:')
  console.log('  node mongo.js <password>             # list all entries')
  console.log('  node mongo.js <password> <name> <number>  # add new entry')
  mongoose.connection.close()
}
