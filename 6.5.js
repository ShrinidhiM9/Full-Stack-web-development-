// src/components/AnecdoteList.jsx
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state)

  // 6.5: order by votes descending
  const ordered = [...anecdotes].sort((a, b) => b.votes - a.votes)

  const handleVote = (id) => {
    dispatch(voteAnecdote(id))
  }

  return (
    <div>
      {ordered.map(anecdote =>
        <div key={anecdote.id} className="anecdote" style={{ marginBottom: 8 }}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button style={{ marginLeft: 8 }} onClick={() => handleVote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
