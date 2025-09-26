// controllers/blogs.js
const express = require('express')
const Blog = require('../models/blog')
const router = express.Router()

router.post('/', async (req, res, next) => {
  try {
    const body = req.body

    // Validation: title AND url are required
    if (!body.title || !body.url) {
      return res.status(400).json({ error: 'title and url required' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    })

    const saved = await blog.save()
    res.status(201).json(saved)
  } catch (err) {
    next(err)
  }
})

module.exports = router
