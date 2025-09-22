import React, { useState, useEffect } from 'react';
import * as personService from './services/persons';  // <-- import the module

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  useEffect(() => {
    personService.getAll().then(data => setPersons(data)); // <-- use service
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber
    };

    personService.create(personObject)  // <-- use service
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
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
