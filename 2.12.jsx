import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => setPersons(response.data));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber
    };

    axios.post('http://localhost:3001/persons', personObject)
      .then(response => {
        setPersons(persons.concat(response.data));
        setNewName('');
        setNewNumber('');
      });
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
        {persons.map(person => <li key={person.id}>{person.name} {person.number}</li>)}
      </ul>
    </div>
  );
};

export default App;
