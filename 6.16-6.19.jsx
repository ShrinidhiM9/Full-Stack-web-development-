// src/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit'
import anecdoteService from './services/anecdotes'

// ===================== Anecdote Slice =====================
const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    // Set initial anecdotes from backend
    setAnecdotes(state, action) {
      return action.payload
    },
    // Append a new anecdote
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    // Update votes for an anecdote
    updateAnecdote(state, action) {
      const updated = action.payload
      return state.map(a => (a.id === updated.id ? updated : a))
    }
  }
})

export const { setAnecdotes, appendAnecdote, updateAnecdote } = anecdoteSlice.actions

// Thunk: Initialize anecdotes from backend
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

// Thunk: Create new anecdote in backend and add to store
export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
    dispatch(setNotification(`You added '${content}'`, 5))
  }
}

// Thunk: Vote for an anecdote (backend + store)
export const voteAnecdote = anecdote => {
  return async dispatch => {
    const updated = await anecdoteService.update({ ...anecdote, votes: anecdote.votes + 1 })
    dispatch(updateAnecdote(updated))
    dispatch(setNotification(`You voted '${anecdote.content}'`, 5))
  }
}

// ===================== Notification Slice =====================
const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotificationMessage(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

export const { setNotificationMessage, clearNotification } = notificationSlice.actions

// Thunk: Set notification for given seconds
export const setNotification = (message, seconds) => {
  return async dispatch => {
    dispatch(setNotificationMessage(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

// ===================== Store =====================
const store = configureStore({
  reducer: {
    anecdotes: anecdoteSlice.reducer,
    notification: notificationSlice.reducer
  }
})

export default store

// ===================== Components =====================

// Notification.jsx
import React from 'react'
import { useSelector } from 'react-redux'

export const Notification = () => {
  const message = useSelector(state => state.notification)
  if (!message) return null

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return <div style={style}>{message}</div>
}

// AnecdoteList.jsx
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from './store'

export const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const dispatch = useDispatch()

  // Sort by votes descending
  const sorted = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {sorted.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}{' '}
            <button onClick={() => dispatch(voteAnecdote(anecdote))}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

// AnecdoteForm.jsx
import React from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from './store'

export const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = event => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
  }

  return (
    <form onSubmit={addAnecdote}>
      <input name="anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

// App.jsx
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initializeAnecdotes } from './store'
import { AnecdoteForm } from './AnecdoteForm'
import { AnecdoteList } from './AnecdoteList'
import { Notification } from './Notification'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  )
}

export default App
