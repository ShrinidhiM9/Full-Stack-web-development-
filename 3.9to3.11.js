const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.static('dist'))

const cors = require('cors')
app.use(cors())


morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
]

// Routes
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = {
    id: Math.floor(Math.random() * 1000000), // generate unique-ish id
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  res.json(person)
})

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
