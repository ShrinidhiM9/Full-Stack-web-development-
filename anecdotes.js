// src/services/anecdotes.js
import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

// Get all anecdotes
export const getAnecdotes = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// Add a new anecdote
export const createAnecdote = async (newAnecdote) => {
  const response = await axios.post(baseUrl, newAnecdote)
  return response.data
}

// Update an anecdote (vote)
export const updateAnecdote = async (anecdote) => {
  const updated = { ...anecdote, votes: anecdote.votes + 1 }
  const response = await axios.put(`${baseUrl}/${anecdote.id}`, updated)
  return response.data
}
