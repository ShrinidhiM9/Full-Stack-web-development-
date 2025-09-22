import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (persons.some((p) => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    const personObject = { name: newName, number: newNumber }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const personsToShow = persons.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <div>
        filter shown with: <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <h3>Add a new</h3>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h3>Numbers</h3>
      {personsToShow.map((p, i) => (
        <p key={i}>{p.name} {p.number}</p>
      ))}
    </div>
  )
}

export default App