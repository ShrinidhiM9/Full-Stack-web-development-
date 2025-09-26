const express = require('express')
const app = express()
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

app.use(express.json())
app.use(middleware.tokenExtractor) // sets req.token for subsequent handlers

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

// error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(500).json({ error: 'internal server error' })
})

module.exports = app
