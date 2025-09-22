const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const Person = require('./models/person')

const app = express()


app.use(cors())
app.use(express.json())

morgan.token('body', (req) => req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Serve frontend in production
app.use(express.static('dist'))



// Get all persons
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error))
})

// Get info
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch(error => next(error))
})

// Get single person
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) res.json(person)
      else res.status(404).json({ error: 'person not found' })
    })
    .catch(error => next(error))
})

// Add new person
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({ name, number })

  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))
})

// Update person number
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) res.json(updatedPerson)
      else res.status(404).json({ error: 'person not found' })
    })
    .catch(error => next(error))
})

// Delete person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) res.status(204).end()
      else res.status(404).json({ error: 'person not found' })
    })
    .catch(error => next(error))
})

// Redirect frontend for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

// ---------------- MIDDLEWARE ---------------- //

// Unknown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Error handler
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') return res.status(400).send({ error: 'malformatted id' })
  if (error.name === 'ValidationError') return res.status(400).json({ error: error.message })

  next(error)
}
app.use(errorHandler)

// ---------------- SERVER ---------------- //
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
