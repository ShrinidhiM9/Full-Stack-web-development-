import React, { useState, useEffect } from 'react';
import * as personService from './services/persons';

const Notification = ({ message, type }) => {
  if (!message) return null;

  const style = {
    color: type === 'success' ? 'green' : 'red',
    background: '#f0f0f0',
    fontSize: 16,
    border: `2px solid ${type === 'success' ? 'green' : 'red'}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return <div style={style}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [notification, setNotification] = useState({ message: null, type: null });

  useEffect(() => {
    personService.getAll().then(data => setPersons(data));
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null, type: null }), 5000); // hide after 5s
  };

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(p => p.name === newName);

    if (existingPerson) {
      if (window.confirm(`${newName} is already added. Replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson));
            setNewName('');
            setNewNumber('');
            showNotification(`Updated ${returnedPerson.name}'s number`, 'success');
          })
          .catch(error => {
            // Handle 404 or other errors
            setPersons(persons.filter(p => p.id !== existingPerson.id)); // remove from state if gone
            showNotification(`Error: Information of ${existingPerson.name} has already been removed`, 'error');
          });
      }
    } else {
      const personObject = { name: newName, number: newNumber };
      personService.create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          showNotification(`Added ${returnedPerson.name}`, 'success');
        })
        .catch(error => showNotification('Error: Could not add person', 'error'));
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
          showNotification(`Deleted ${name}`, 'success');
        })
        .catch(() => showNotification(`Error: Information of ${name} has already been removed`, 'error'));
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
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
