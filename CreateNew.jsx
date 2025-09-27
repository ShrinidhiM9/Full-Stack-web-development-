// inside your App.js (or CreateNew.jsx) — updated CreateNew component
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useField } from './hooks' // path to hooks

const CreateNew = ({ addNew }) => {
  const navigate = useNavigate()

  // note the destructuring that removes reset from the spreadable object-7.6
  const { reset: resetContent, ...content } = useField('text')
  const { reset: resetAuthor,  ...author }  = useField('text')
  const { reset: resetInfo,    ...info }    = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/') //  exercise 7.3
  }

  const handleResetAll = (e) => {
    e.preventDefault()
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>

        <div style={{ marginTop: 8 }}>
          <button type="submit">create</button>
          {/* reset must be type="button" (so it doesn't submit the form) */}
          <button type="button" onClick={handleResetAll} style={{ marginLeft: 8 }}>
            reset
          </button>
        </div>
      </form>
    </div>
  )
}
