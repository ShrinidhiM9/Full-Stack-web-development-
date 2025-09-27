// src/components/AnecdoteView.jsx
import React from 'react'
import { useParams } from 'react-router-dom'

const AnecdoteView = ({ anecdotes }) => {
  const { id } = useParams()
  const anecdote = anecdotes.find(a => String(a.id) === String(id))

  if (!anecdote) return <div>anecdote not found</div>

  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  )
}

export default AnecdoteView
