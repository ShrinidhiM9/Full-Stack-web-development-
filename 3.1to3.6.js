const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

// 3.1: get all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// 3.2: info page
app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)
})

// 3.3: get person by id
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// 3.4: delete person
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

// 3.5 + 3.6: add new person with error handling
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name: body.name,
    number: body.number,
  }

  persons.push(person)
  res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
