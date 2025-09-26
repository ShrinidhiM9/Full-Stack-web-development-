import React, { createContext, useReducer, useContext } from 'react'

// Actions
const SET_NOTIFICATION = 'SET_NOTIFICATION'
const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION'

// Reducer for notifications
const notificationReducer = (state, action) => {
  switch (action.type) {
    case SET_NOTIFICATION:
      return action.payload
    case CLEAR_NOTIFICATION:
      return null
    default:
      return state
  }
}

// Context
const NotificationContext = createContext()

export const useNotification = () => useContext(NotificationContext)

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  const setNotification = (message, duration = 5) => {
    dispatch({ type: SET_NOTIFICATION, payload: message })
    setTimeout(() => {
      dispatch({ type: CLEAR_NOTIFICATION })
    }, duration * 1000)
  }

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}
