// ===================== store.js =====================
import { configureStore, createSlice } from '@reduxjs/toolkit'
import anecdoteService from './services/anecdotes'

// ===================== Anecdote Slice =====================
const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    updateAnecdote(state, action) {
      const updated = action.payload
      return state.map(a => (a.id === updated.id ? updated : a))
    }
  }
})

export const { setAnecdotes, appendAnecdote, updateAnecdote } = anecdoteSlice.actions

// Thunks for async operations
export const initializeAnecdotes = () => async dispatch => {
  const anecdotes = await anecdoteService.getAll()
  dispatch(setAnecdotes(anecdotes))
}

export const createAnecdote = content => async dispatch => {
  const newAnecdote = await anecdoteService.createNew(content)
  dispatch(appendAnecdote(newAnecdote))
  dispatch(setNotification(`You added '${content}'`, 5))
}

export const voteAnecdote = anecdote => async dispatch => {
  const updated = await anecdoteService.update({ ...anecdote, votes: anecdote.votes + 1 })
  dispatch(updateAnecdote(updated))
  dispatch(setNotification(`You voted '${anecdote.content}'`, 5))
}

// ===================== Notification Slice =====================
const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotificationMessage: (state, action) => action.payload,
    clearNotification: () => ''
  }
})

export const { setNotificationMessage, clearNotification } = notificationSlice.actions

export const setNotification = (message, seconds) => async dispatch => {
  dispatch(setNotificationMessage(message))
  setTimeout(() => dispatch(clearNotification()), seconds * 1000)
}

// ===================== Filter Slice =====================
const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    setFilter: (state, action) => action.payload,
    clearFilter: () => ''
  }
})

export const { setFilter, clearFilter } = filterSlice.actions

// ===================== Configure Store =====================
const store = configureStore({
  reducer: {
    anecdotes: anecdoteSlice.reducer,
    notification: notificationSlice.reducer,
    filter: filterSlice.reducer
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
  const style = { border: 'solid', padding: 10, borderWidth: 1, marginBottom: 10 }
  return <div style={style}>{message}</div>
}

// Filter.jsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilter } from './store'

export const Filter = () => {
  const dispatch = useDispatch()
  const value = useSelector(state => state.filter)

  const handleChange = e => dispatch(setFilter(e.target.value))

  const style = { marginBottom: 10 }

  return (
    <div style={style}>
      filter <input value={value} onChange={handleChange} />
    </div>
  )
}

// AnecdoteList.jsx
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from './store'

export const AnecdoteList = () => {
  const dispatch = useDispatch()
  const filter = useSelector(state => state.filter)
  const anecdotes = useSelector(state => state.anecdotes)

  const filtered = anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
  const sorted = [...filtered].sort((a, b) => b.votes - a.votes)

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
import { Filter } from './Filter'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => { dispatch(initializeAnecdotes()) }, [dispatch])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  )
}

export default App
