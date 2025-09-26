import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from './services/anecdotes'
import Notification from './Notification'
import { useNotification } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const { setNotification } = useNotification()

  const { data: anecdotes, isLoading, isError } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      setNotification({ message: 'New anecdote added!', type: 'success' }, 5)
    },
    onError: () => {
      setNotification({ message: 'Anecdote must be at least 5 characters long', type: 'error' }, 5)
    }
  })

  const voteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      setNotification({ message: 'Anecdote voted!', type: 'success' }, 5)
    }
  })

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote)
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Anecdote service not available due to server problems</div>

  return (
    <div>
      <h2>Anecdotes</h2>

      <Notification />

      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>

      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}{' '}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  )
}

export default App
