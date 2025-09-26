const bcrypt = require('bcrypt') // or bcryptjs if you installed that
const usersRouter = require('express').Router()
const User = require('../models/user')

// GET /api/users (list all users, embedding their blogs)
usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({}).populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
      id: 1
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

// POST /api/users (create new user)
usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' })
    }
    if (username.length < 3 || password.length < 3) {
      return res.status(400).json({
        error: 'username and password must be at least 3 characters long'
      })
    }

    const existing = await User.findOne({ username })
    if (existing) {
      return res.status(400).json({ error: 'username must be unique' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const saved = await user.save()
    res.status(201).json(saved)
  } catch (err) {
    next(err)
  }
})

module.exports = usersRouter
