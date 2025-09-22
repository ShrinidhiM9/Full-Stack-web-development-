import React, { useState, useEffect } from 'react';
import * as personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  useEffect(() => {
    personService.getAll().then(data => setPersons(data));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = { name: newName, number: newNumber };

    personService.create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
      });
  };

  // Delete handler
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id)
        .then(() => setPersons(persons.filter(p => p.id !== id)))
        .catch(() => alert(`Information of ${name} has already been removed from server`));
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name" />
        <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} placeholder="Number" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {persons.map(person => (
          <li key={person.id}>
            {person.name} {person.number} 
            <button onClick={() => handleDelete(person.id, person.name)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
