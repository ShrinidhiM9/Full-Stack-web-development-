const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()   // so we can use env vars like MONGODB_URI

const Person = require('./models/person')

const app = express()
require('dotenv').config()

app.use(cors())
app.use(express.json())

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Get all persons
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

// Add a new person
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => {
      console.error(error)
      res.status(500).json({ error: 'something went wrong' })
    })
})


// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
